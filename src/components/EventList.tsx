
import React from 'react';
import EventCard from './EventCard';
import { SGDEvent } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface EventListProps {
  events: SGDEvent[];
  title?: string;
  emptyMessage?: string;
  isLoading?: boolean;
}

const EventList: React.FC<EventListProps> = ({ 
  events, 
  title = "Upcoming Events", 
  emptyMessage = "No events found. Check back later or create your own!",
  isLoading = false
}) => {
  // Loading skeletons
  if (isLoading) {
    return (
      <div className="py-4">
        {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <Skeleton className="h-40 w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-6" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
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
