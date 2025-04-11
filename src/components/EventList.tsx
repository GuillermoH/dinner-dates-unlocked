
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
  return (
    <div className="py-4">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      
      {events.length === 0 ? (
        <div className="text-center p-8 bg-muted rounded-lg">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
