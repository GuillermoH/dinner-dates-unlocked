
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SGDEvent } from '@/types';
import { jsonToAttendees, isValidVisibility } from '@/utils/typeGuards';

export const useEvent = (id: string | undefined) => {
  const { 
    data: event, 
    isLoading, 
    error 
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
        // Ensure visibility is a valid EventVisibility type
        visibility: isValidVisibility(data.visibility) ? data.visibility : 'public'
      };
      
      return transformedEvent;
    },
    enabled: !!id,
  });

  return {
    event,
    isLoading,
    error
  };
};
