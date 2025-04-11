
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Calendar, PlusCircle, ArrowLeft, Users } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Community, SGDEvent, Attendee } from '@/types';
import EventList from '@/components/EventList';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

// Type guard to check if a value is an Attendee
const isAttendee = (value: any): value is Attendee => {
  return typeof value === 'object' && value !== null && 
    'id' in value && 
    'name' in value && 
    'email' in value;
};

// Convert Json array to Attendee array with type safety
const jsonToAttendees = (json: Json | null): Attendee[] => {
  if (!json || !Array.isArray(json)) return [];
  
  return json.filter(isAttendee);
};

const CommunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
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

  // Transform database events to SGDEvent type
  const events: SGDEvent[] | undefined = eventsData?.map(event => ({
    ...event,
    attendees: jsonToAttendees(event.attendees),
    waitlist: jsonToAttendees(event.waitlist)
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

  const handleJoinCommunity = () => {
    if (!user) {
      toast.error("Please log in to join this community");
      navigate('/login');
      return;
    }
    
    joinCommunityMutation.mutate();
  };

  const isLoading = isLoadingCommunity || isLoadingEvents || joinCommunityMutation.isPending;
  const error = communityError || eventsError;

  if (isLoadingCommunity || isLoadingEvents) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p>Error loading community data: {(error as Error).message}</p>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="container-custom py-8">
        <div className="bg-muted p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Community not found</h2>
          <p className="mb-6">The community you're looking for doesn't exist or you don't have access to it.</p>
          <Link to="/communities">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Communities
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isMember = user && community.members?.includes(user.id);
  const isAdmin = user && community.admins?.includes(user.id);

  return (
    <div className="container-custom py-8">
      <Link to="/communities" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Communities
      </Link>
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{community.name}</h1>
          <p className="text-muted-foreground mb-4">{community.description}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>{community.members?.length || 0} members</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          {(isAdmin || isMember) && (
            <Link to={`/create-event?communityId=${community.id}`}>
              <Button className="flex items-center gap-1">
                <PlusCircle className="h-4 w-4" />
                Create Event
              </Button>
            </Link>
          )}
          
          {!isMember && user && (
            <Button 
              variant="outline" 
              onClick={handleJoinCommunity}
              disabled={joinCommunityMutation.isPending}
            >
              {joinCommunityMutation.isPending ? "Joining..." : "Join Community"}
            </Button>
          )}
        </div>
      </div>
      
      <Card className="p-6 mb-8">
        <div className="flex items-center mb-4">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-xl font-semibold">Community Events</h2>
        </div>
        
        {events && events.length > 0 ? (
          <EventList 
            events={events} 
            title="" 
            emptyMessage="This community doesn't have any events yet." 
          />
        ) : (
          <div className="text-center p-8 bg-muted rounded-lg">
            <p className="text-muted-foreground">This community doesn't have any events yet.</p>
            {(isAdmin || isMember) && (
              <Link to={`/create-event?communityId=${community.id}`} className="mt-4 inline-block">
                <Button size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create First Event
                </Button>
              </Link>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default CommunityDetail;
