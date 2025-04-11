
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, Share2, ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useEvent } from '@/hooks/useEvent';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import RSVPStatusDialog from '@/components/RSVPStatusDialog';
import AttendeesList from '@/components/AttendeesList';
import { RSVPStatus } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rsvpDialogOpen, setRsvpDialogOpen] = useState(false);
  const { user } = useAuth();
  
  const { event, isLoading, error, updateRSVPStatus, getUserRsvpStatus } = useEvent(id);
  
  const [userRsvpStatus, setUserRsvpStatus] = useState<RSVPStatus | null>(null);
  
  useEffect(() => {
    if (event && user) {
      const status = getUserRsvpStatus();
      setUserRsvpStatus(status);
    }
  }, [event, user, getUserRsvpStatus]);
  
  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-2/3" />
            </div>
            <Skeleton className="h-80 w-full my-6" />
            <Skeleton className="h-8 w-1/4 mt-6 mb-2" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !event) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
        <p className="mb-6">
          {error ? `Error: ${(error as Error).message}` : "The event you're looking for doesn't exist."}
        </p>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }
  
  const eventDate = new Date(event.date_time);
  const formattedDate = format(eventDate, "EEEE, MMMM d, yyyy");
  const formattedTime = format(eventDate, "h:mm a");
  
  // Calculate attendee count from attendees_by_status
  const attendeeCount = 
    (event.attendees_by_status?.going.length || 0) + 
    (event.attendees_by_status?.maybe.length || 0);
  const availableSpots = Math.max(0, event.capacity - attendeeCount);
  const isFull = availableSpots === 0;
  
  const handleRSVP = async (status: RSVPStatus) => {
    if (!user) {
      toast.error("You must be logged in to RSVP");
      return { success: false };
    }
    
    console.log("Attempting RSVP with status:", status);
    
    const result = await updateRSVPStatus(user.id, user.email || '', user.user_metadata?.name || 'Anonymous', status);
    
    if (result.success) {
      setUserRsvpStatus(status);
      toast.success(`RSVP successfully updated to ${status}!`);
    } else {
      toast.error("Failed to update RSVP. Please try again.");
    }
    
    return result;
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };
  
  const generateICalFile = () => {
    const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//University SGDs Platform//EN
BEGIN:VEVENT
UID:${event.id}
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
LOCATION:${event.location}
DTSTART:${format(eventDate, "yyyyMMdd'T'HHmmss")}
DTEND:${format(new Date(eventDate.getTime() + 2 * 60 * 60 * 1000), "yyyyMMdd'T'HHmmss")}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icalContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/\s+/g, '-')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const getRsvpButtonText = () => {
    if (!userRsvpStatus) {
      return isFull ? 'Join Waitlist' : 'RSVP Now';
    }
    
    switch (userRsvpStatus) {
      case 'going':
        return 'You\'re Going';
      case 'maybe':
        return 'You\'re Maybe Going';
      case 'not_going':
        return 'You\'re Not Going';
      default:
        return 'Update RSVP';
    }
  };
  
  const showCalendarButton = userRsvpStatus === 'going' || userRsvpStatus === 'maybe';
  
  return (
    <div className="container-custom py-8">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold">{event.title}</h1>
                <Badge 
                  variant={event.visibility === "public" ? "default" : 
                          event.visibility === "community" ? "secondary" : "outline"}
                >
                  {event.visibility === "public" ? "Public" : 
                  event.visibility === "community" ? "Community" : "Private"}
                </Badge>
              </div>
              
              <p className="text-muted-foreground mb-4">Hosted by {event.host_name}</p>
            </div>
            
            <div className="flex flex-col gap-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{formattedTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>
                  {attendeeCount} / {event.capacity} attendees
                  {availableSpots > 0 && ` (${availableSpots} spots left)`}
                </span>
              </div>
            </div>
            
            {event.image && (
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full rounded-lg object-cover max-h-80 my-4"
              />
            )}
            
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">About this event</h2>
              <p className="text-base whitespace-pre-line">{event.description}</p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="sticky top-24 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-1">
                    {event.is_paid ? `$${event.price}` : 'Free Event'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isFull ? 'This event is full' : `${availableSpots} spots remaining`}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      if (!user) {
                        toast.error("You must be logged in to RSVP");
                        navigate('/login');
                        return;
                      }
                      setRsvpDialogOpen(true);
                    }}
                    variant={userRsvpStatus === 'going' ? 'default' : 
                             userRsvpStatus === 'maybe' ? 'secondary' : 
                             userRsvpStatus === 'not_going' ? 'outline' : 'default'}
                  >
                    {getRsvpButtonText()}
                  </Button>
                  
                  <RSVPStatusDialog 
                    isOpen={rsvpDialogOpen} 
                    onOpenChange={setRsvpDialogOpen}
                    onSubmit={handleRSVP}
                    eventIsPaid={event.is_paid}
                    eventPrice={event.price}
                    currentStatus={userRsvpStatus}
                  />
                  
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  
                  {showCalendarButton && (
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={generateICalFile}
                    >
                      <CalendarIcon className="h-4 w-4" />
                      Add to Calendar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Attendees</h3>
                <AttendeesList 
                  attendeesByStatus={event.attendees_by_status || { going: [], maybe: [], not_going: [] }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
