
import React from 'react';
import EventCard from './EventCard';
import { SGDEvent } from '@/types';

interface EventListProps {
  events: SGDEvent[];
  title?: string;
  emptyMessage?: string;
}

const EventList: React.FC<EventListProps> = ({ 
  events, 
  title = "Upcoming Events", 
  emptyMessage = "No events found. Check back later or create your own!" 
}) => {
  // Convert date_time to dateTime for compatibility with EventCard component
  const formattedEvents = events.map(event => ({
    ...event,
    dateTime: event.date_time,
    hostId: event.host_id,
    hostName: event.host_name,
    isPaid: event.is_paid,
    communityId: event.community_id,
  }));

  return (
    <div className="py-4">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      
      {events.length === 0 ? (
        <div className="text-center p-8 bg-muted rounded-lg">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formattedEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
