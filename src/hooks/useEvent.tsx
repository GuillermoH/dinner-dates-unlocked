
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SGDEvent, Attendee, RSVPStatus } from '@/types';
import { jsonToAttendees, isValidVisibility } from '@/utils/typeGuards';
import { Json } from '@/integrations/supabase/types';

export const useEvent = (id: string | undefined) => {
  const { 
    data: event, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!id) throw new Error('Event ID is required');
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Parse the attendees_by_status safely
      let attendeesByStatus = { going: [], maybe: [], not_going: [] };
      
      if (data.attendees_by_status) {
        // Check if attendees_by_status is an object and has the expected properties
        const parsedStatus = data.attendees_by_status as any;
        
        if (parsedStatus && typeof parsedStatus === 'object') {
          attendeesByStatus = {
            going: Array.isArray(parsedStatus.going) ? jsonToAttendees(parsedStatus.going) : [],
            maybe: Array.isArray(parsedStatus.maybe) ? jsonToAttendees(parsedStatus.maybe) : [],
            not_going: Array.isArray(parsedStatus.not_going) ? jsonToAttendees(parsedStatus.not_going) : []
          };
        }
      }
      
      // Transform database event to SGDEvent type with proper type conversions
      const transformedEvent: SGDEvent = {
        ...data,
        attendees: jsonToAttendees(data.attendees),
        waitlist: jsonToAttendees(data.waitlist),
        attendees_by_status: attendeesByStatus,
        // Ensure visibility is a valid EventVisibility type
        visibility: isValidVisibility(data.visibility) ? data.visibility : 'public'
      };
      
      return transformedEvent;
    },
    enabled: !!id,
  });

  // Function to update an attendee's RSVP status
  const updateRSVPStatus = async (
    attendeeId: string, 
    email: string, 
    name: string, 
    status: RSVPStatus
  ) => {
    if (!id || !event) return { success: false };
    
    const attendee: Attendee = {
      id: attendeeId,
      name,
      email,
      rsvpStatus: status
    };

    // Initialize the status groups if they don't exist
    const updatedStatusGroups = event.attendees_by_status || { 
      going: [], 
      maybe: [], 
      not_going: [] 
    };
    
    // Create a deep copy to avoid mutating the state directly
    const statusGroups = {
      going: [...updatedStatusGroups.going],
      maybe: [...updatedStatusGroups.maybe],
      not_going: [...updatedStatusGroups.not_going]
    };
    
    // Remove the attendee from all status groups
    Object.keys(statusGroups).forEach(key => {
      const statusKey = key as RSVPStatus;
      statusGroups[statusKey] = statusGroups[statusKey].filter(a => a.id !== attendeeId);
    });
    
    // Add the attendee to the appropriate status group
    statusGroups[status] = [...statusGroups[status], attendee];
    
    // Update the database with structured data
    try {
      const { error } = await supabase
        .from('events')
        .update({
          attendees_by_status: statusGroups
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating RSVP status:', error);
        return { success: false, error };
      }
      
      // Refetch to get the updated data
      await refetch();
      
      return { success: true };
    } catch (err) {
      console.error('Error in update function:', err);
      return { success: false, error: err };
    }
  };

  return {
    event,
    isLoading,
    error,
    updateRSVPStatus
  };
};
