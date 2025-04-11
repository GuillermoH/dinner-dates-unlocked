
import React from 'react';
import { Check, HelpCircle, X, Users } from 'lucide-react';
import { Attendee } from '@/types';

interface AttendeesListProps {
  attendeesByStatus: {
    going: Attendee[];
    maybe: Attendee[];
    not_going: Attendee[];
  };
  className?: string;
}

const AttendeesList: React.FC<AttendeesListProps> = ({ 
  attendeesByStatus,
  className 
}) => {
  const totalAttendees = 
    attendeesByStatus.going.length + 
    attendeesByStatus.maybe.length + 
    attendeesByStatus.not_going.length;
    
  if (totalAttendees === 0) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No attendees yet. Be the first to RSVP!</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {attendeesByStatus.going.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            Going ({attendeesByStatus.going.length})
          </h3>
          <ul className="space-y-1">
            {attendeesByStatus.going.map(attendee => (
              <li key={attendee.id} className="text-sm">
                {attendee.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {attendeesByStatus.maybe.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-amber-500" />
            Maybe ({attendeesByStatus.maybe.length})
          </h3>
          <ul className="space-y-1">
            {attendeesByStatus.maybe.map(attendee => (
              <li key={attendee.id} className="text-sm">
                {attendee.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {attendeesByStatus.not_going.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <X className="h-4 w-4 text-red-500" />
            Not Going ({attendeesByStatus.not_going.length})
          </h3>
          <ul className="space-y-1">
            {attendeesByStatus.not_going.map(attendee => (
              <li key={attendee.id} className="text-sm">
                {attendee.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AttendeesList;
