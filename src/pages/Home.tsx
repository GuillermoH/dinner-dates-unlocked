
import React, { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import EventList from '@/components/EventList';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SGDEvent } from '@/types';
import { jsonToAttendees, isValidVisibility } from '@/utils/typeGuards';
import { toast } from 'sonner';

const Home = () => {
  const { user } = useAuth();
  const [publicEvents, setPublicEvents] = useState<SGDEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPublicEvents = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('visibility', 'public')
          .order('date_time', { ascending: true });
          
        if (error) throw error;
        
        // Transform database events to SGDEvent type with proper type conversions
        const transformedEvents: SGDEvent[] = data.map(event => ({
          ...event,
          attendees: jsonToAttendees(event.attendees),
          waitlist: jsonToAttendees(event.waitlist),
          // Ensure visibility is a valid EventVisibility type
          visibility: isValidVisibility(event.visibility) ? event.visibility : 'public'
        }));
        
        setPublicEvents(transformedEvents);
      } catch (error) {
        console.error('Error fetching public events:', error);
        toast.error('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPublicEvents();
  }, []);
  
  return (
    <div>
      <Hero />
      <div className="container-custom mx-auto">
        {user && (
          <div className="mb-8 flex justify-center">
            <Link to="/create-event">
              <Button size="lg" className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Create a Small Group Dinner
              </Button>
            </Link>
          </div>
        )}
        
        <EventList 
          events={publicEvents} 
          title="Recent Public Events" 
          isLoading={isLoading}
        />
        
        {!user && (
          <div className="my-12 p-6 bg-muted rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-3">Join the Community</h2>
            <p className="mb-6 text-muted-foreground">
              Login to create your own Small Group Dinners and connect with others.
            </p>
            <Link to="/login">
              <Button size="lg">Login or Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
