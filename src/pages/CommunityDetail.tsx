
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import CommunityHeader from '@/components/community/CommunityHeader';
import CommunityEvents from '@/components/community/CommunityEvents';
import { useCommunity } from '@/hooks/useCommunity';

const CommunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    community,
    events,
    isLoading,
    error,
    isMember,
    isAdmin,
    joinCommunity,
    joinCommunityPending
  } = useCommunity(id);

  const handleJoinCommunity = () => {
    if (!user) {
      toast.error("Please log in to join this community");
      navigate('/login');
      return;
    }
    
    joinCommunity();
  };

  if (isLoading) {
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

  return (
    <div className="container-custom py-8">
      <Link to="/communities" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Communities
      </Link>
      
      <CommunityHeader
        community={community}
        isMember={!!isMember}
        isAdmin={!!isAdmin}
        isJoining={joinCommunityPending}
        onJoin={handleJoinCommunity}
        user={!!user}
      />
      
      <CommunityEvents
        events={events}
        communityId={community.id}
        isMember={!!isMember}
        isAdmin={!!isAdmin}
      />
    </div>
  );
};

export default CommunityDetail;
