
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Community, SGDEvent } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { jsonToAttendees, isValidVisibility } from '@/utils/typeGuards';

export const useCommunity = (id: string | undefined) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch community details
  const { 
    data: community, 
    isLoading: isLoadingCommunity,
    error: communityError 
  } = useQuery({
    queryKey: ['community', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Community;
    },
    enabled: !!id,
  });

  // Fetch community events
  const { 
    data: eventsData, 
    isLoading: isLoadingEvents,
    error: eventsError 
  } = useQuery({
    queryKey: ['community-events', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('community_id', id)
        .order('date_time', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Transform database events to SGDEvent type with proper type conversions
  const events: SGDEvent[] | undefined = eventsData?.map(event => ({
    ...event,
    attendees: jsonToAttendees(event.attendees),
    waitlist: jsonToAttendees(event.waitlist),
    // Ensure visibility is a valid EventVisibility type
    visibility: isValidVisibility(event.visibility) ? event.visibility : 'public'
  }));

  // Join community mutation
  const joinCommunityMutation = useMutation({
    mutationFn: async () => {
      if (!user || !community) return;
      
      // Get current members array
      const updatedMembers = [...(community.members || [])];
      
      // Add current user if not already a member
      if (!updatedMembers.includes(user.id)) {
        updatedMembers.push(user.id);
      }
      
      const { error } = await supabase
        .from('communities')
        .update({ members: updatedMembers })
        .eq('id', id);
      
      if (error) throw error;
      
      return updatedMembers;
    },
    onSuccess: () => {
      toast.success("You have joined the community!");
      // Invalidate queries to reload data
      queryClient.invalidateQueries({ queryKey: ['community', id] });
    },
    onError: (error) => {
      toast.error(`Failed to join: ${(error as Error).message}`);
    }
  });

  const isLoading = isLoadingCommunity || isLoadingEvents || joinCommunityMutation.isPending;
  const error = communityError || eventsError;

  const isMember = user && community?.members?.includes(user.id);
  const isAdmin = user && community?.admins?.includes(user.id);

  return {
    community,
    events,
    isLoading,
    error,
    isMember,
    isAdmin,
    joinCommunity: joinCommunityMutation.mutate,
    joinCommunityPending: joinCommunityMutation.isPending
  };
};
