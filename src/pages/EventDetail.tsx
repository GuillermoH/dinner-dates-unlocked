
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockEvents } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, Share2, ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rsvpDialogOpen, setRsvpDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const event = mockEvents.find(e => e.id === id);
  
  if (!event) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
        <p className="mb-6">The event you're looking for doesn't exist.</p>
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
  
  const attendeeCount = event.attendees.length;
  const availableSpots = Math.max(0, event.capacity - attendeeCount);
  const isFull = availableSpots === 0;
  
  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally connect to a backend to save the RSVP
    toast.success("RSVP successful! Check your email for confirmation.");
    setRsvpDialogOpen(false);
  };
  
  const handleShare = () => {
    // Would normally use proper sharing APIs
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };
  
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
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold">{event.title}</h1>
              <Badge 
                variant={event.visibility === "public" ? "default" : 
                        event.visibility === "community" ? "secondary" : "outline"}
              >
                {event.visibility === "public" ? "Public" : 
                 event.visibility === "community" ? "Community" : "Private"}
              </Badge>
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
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Hosted by</h2>
              <p>{event.host_name}</p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="sticky top-24 bg-white rounded-lg border p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">
                {event.is_paid ? `$${event.price}` : 'Free Event'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isFull ? 'This event is full' : `${availableSpots} spots remaining`}
              </p>
            </div>
            
            <div className="space-y-4">
              <Dialog open={rsvpDialogOpen} onOpenChange={setRsvpDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    {isFull ? 'Join Waitlist' : 'RSVP Now'}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {isFull ? 'Join the Waitlist' : 'RSVP to this event'}
                    </DialogTitle>
                    <DialogDescription>
                      Fill out your details below to {isFull ? 'join the waitlist' : 'reserve your spot'}.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleRSVP} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    {event.is_paid && (
                      <div className="text-sm text-muted-foreground">
                        <p>This is a paid event. After RSVP, you'll receive payment instructions.</p>
                      </div>
                    )}
                    <DialogFooter>
                      <Button type="submit" className="w-full">
                        {isFull ? 'Join Waitlist' : 'Confirm RSVP'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <CalendarIcon className="h-4 w-4" />
                Add to Calendar
              </Button>
            </div>
            
            {attendeeCount > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Attendees ({attendeeCount})</h3>
                <ul className="space-y-2">
                  {event.attendees.map(attendee => (
                    <li key={attendee.id} className="text-sm">
                      {attendee.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {event.waitlist.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Waitlist ({event.waitlist.length})</h3>
                <ul className="space-y-2">
                  {event.waitlist.map(attendee => (
                    <li key={attendee.id} className="text-sm">
                      {attendee.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
