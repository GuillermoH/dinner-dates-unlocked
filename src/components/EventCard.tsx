
import React from 'react';
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { SGDEvent } from "@/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: SGDEvent;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, className }) => {
  const eventDate = new Date(event.date_time);
  const formattedDate = format(eventDate, "MMM d, yyyy");
  const formattedTime = format(eventDate, "h:mm a");
  
  const attendeeCount = event.attendees.length;
  const availableSpots = Math.max(0, event.capacity - attendeeCount);
  const isFull = availableSpots === 0;
  
  return (
    <div className={cn("event-card", className)}>
      <div className="flex flex-col h-full">
        <Link to={`/event/${event.id}`} className="flex-grow">
          {event.image && (
            <div className="mb-3 -mx-4 -mt-4 overflow-hidden rounded-t-lg">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-40 object-cover"
              />
            </div>
          )}
          
          <div className="flex flex-col flex-grow">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold line-clamp-1">{event.title}</h3>
              <Badge 
                variant={event.visibility === "public" ? "default" : 
                        event.visibility === "community" ? "secondary" : "outline"}
                className="ml-2 whitespace-nowrap"
              >
                {event.visibility === "public" ? "Public" : 
                event.visibility === "community" ? "Community" : "Private"}
              </Badge>
            </div>
            
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">
              {event.description}
            </p>
            
            <div className="flex flex-col gap-1 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{formattedTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{attendeeCount} / {event.capacity} spots filled</span>
              </div>
            </div>
          </div>
        </Link>
        
        <div className="flex justify-between items-center mt-auto">
          <div className="text-sm">
            {event.is_paid ? (
              <span className="font-medium">${event.price}</span>
            ) : (
              <span className="text-success font-medium">Free</span>
            )}
          </div>
          <Link to={`/event/${event.id}`}>
            <Button variant={isFull ? "outline" : "default"}>
              {isFull ? "Join Waitlist" : "RSVP"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
