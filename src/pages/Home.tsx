
import React from 'react';
import Hero from '@/components/Hero';
import EventList from '@/components/EventList';
import { mockEvents } from '@/data/mockData';

const Home = () => {
  // Filter to only public events for the homepage
  const publicEvents = mockEvents.filter(event => event.visibility === "public");
  
  return (
    <div>
      <Hero />
      <div className="container-custom mx-auto">
        <EventList events={publicEvents} title="Recent Public Events" />
      </div>
    </div>
  );
};

export default Home;
