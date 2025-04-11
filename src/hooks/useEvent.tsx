
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SGDEvent, Attendee, RSVPStatus } from '@/types';
import { jsonToAttendees, isValidVisibility } from '@/utils/typeGuards';
import { Json } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

export const useEvent = (id: string | undefined) => {
  const { user } = useAuth();
  
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
    
    console.log("Updating RSVP status for:", attendeeId, "Status:", status);
    console.log("Updated status groups:", statusGroups);
    
    try {
      // Convert the statusGroups object to a format that Supabase can handle
      const supabaseFormat = {
        going: statusGroups.going.map(a => ({
          id: a.id,
          name: a.name,
          email: a.email,
          rsvpStatus: a.rsvpStatus,
          paymentStatus: a.paymentStatus
        })),
        maybe: statusGroups.maybe.map(a => ({
          id: a.id,
          name: a.name,
          email: a.email,
          rsvpStatus: a.rsvpStatus,
          paymentStatus: a.paymentStatus
        })),
        not_going: statusGroups.not_going.map(a => ({
          id: a.id,
          name: a.name,
          email: a.email,
          rsvpStatus: a.rsvpStatus,
          paymentStatus: a.paymentStatus
        }))
      };

      console.log("Sending to Supabase:", supabaseFormat);
      
      const { error } = await supabase
        .from('events')
        .update({
          attendees_by_status: supabaseFormat
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

  // Check if current user has RSVPed to this event
  const getUserRsvpStatus = (): RSVPStatus | null => {
    if (!event?.attendees_by_status || !user) return null;
    
    if (event.attendees_by_status.going.some(a => a.id === user.id)) {
      return 'going';
    } else if (event.attendees_by_status.maybe.some(a => a.id === user.id)) {
      return 'maybe';
    } else if (event.attendees_by_status.not_going.some(a => a.id === user.id)) {
      return 'not_going';
    }
    
    return null;
  };

  return {
    event,
    isLoading,
    error,
    updateRSVPStatus,
    getUserRsvpStatus
  };
};
