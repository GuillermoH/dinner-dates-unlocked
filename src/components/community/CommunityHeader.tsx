
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, PlusCircle } from 'lucide-react';
import { Community } from '@/types';

interface CommunityHeaderProps {
  community: Community;
  isMember: boolean;
  isAdmin: boolean;
  isJoining: boolean;
  onJoin: () => void;
  user: boolean;
}

const CommunityHeader: React.FC<CommunityHeaderProps> = ({
  community,
  isMember,
  isAdmin,
  isJoining,
  onJoin,
  user
}) => {
  return (
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
            onClick={onJoin}
            disabled={isJoining}
          >
            {isJoining ? "Joining..." : "Join Community"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CommunityHeader;
