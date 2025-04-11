
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SGDEvent } from '@/types';
import { jsonToAttendees, isValidVisibility } from '@/utils/typeGuards';

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
      
      // Transform database event to SGDEvent type with proper type conversions
      const transformedEvent: SGDEvent = {
        ...data,
        attendees: jsonToAttendees(data.attendees),
        waitlist: jsonToAttendees(data.waitlist),
        // Include attendees_by_status if available
        attendees_by_status: data.attendees_by_status || {
          going: [],
          maybe: [],
          not_going: []
        },
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
    status: 'going' | 'maybe' | 'not_going'
  ) => {
    if (!id || !event) return { success: false };
    
    const attendee = {
      id: attendeeId,
      name,
      email,
      rsvpStatus: status
    };

    // Create a copy of the current attendees_by_status
    const updatedStatusGroups = { ...event.attendees_by_status };
    
    // Remove the attendee from all status groups
    Object.keys(updatedStatusGroups).forEach(key => {
      const statusKey = key as 'going' | 'maybe' | 'not_going';
      updatedStatusGroups[statusKey] = updatedStatusGroups[statusKey].filter(a => a.id !== attendeeId);
    });
    
    // Add the attendee to the appropriate status group
    updatedStatusGroups[status] = [...updatedStatusGroups[status], attendee];
    
    // Update the database
    const { error } = await supabase
      .from('events')
      .update({
        attendees_by_status: updatedStatusGroups
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating RSVP status:', error);
      return { success: false, error };
    }
    
    // Refetch to get the updated data
    await refetch();
    
    return { success: true };
  };

  return {
    event,
    isLoading,
    error,
    updateRSVPStatus
  };
};
