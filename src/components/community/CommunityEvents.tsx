
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, PlusCircle } from 'lucide-react';
import { SGDEvent } from '@/types';
import EventList from '@/components/EventList';

interface CommunityEventsProps {
  events: SGDEvent[] | undefined;
  communityId: string;
  isMember: boolean;
  isAdmin: boolean;
}

const CommunityEvents: React.FC<CommunityEventsProps> = ({
  events,
  communityId,
  isMember,
  isAdmin
}) => {
  return (
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
            <Link to={`/create-event?communityId=${communityId}`} className="mt-4 inline-block">
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create First Event
              </Button>
            </Link>
          )}
        </div>
      )}
    </Card>
  );
};

export default CommunityEvents;
