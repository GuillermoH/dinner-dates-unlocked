
import React from 'react';
import Hero from '@/components/Hero';
import EventList from '@/components/EventList';
import { mockEvents } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  
  // Filter to only public events for the homepage
  const publicEvents = mockEvents.filter(event => event.visibility === "public");
  
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
        
        <EventList events={publicEvents} title="Recent Public Events" />
        
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
