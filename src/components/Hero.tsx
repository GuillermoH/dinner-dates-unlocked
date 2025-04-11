
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-primary/10 to-secondary/5 py-12 md:py-20">
      <div className="container-custom mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Dinner Gatherings <span className="text-primary">Made Simple</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Create, discover, and join small group dinners across your university community. 
            No sign-up required, just verify your email and you're good to go.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create-event">
              <Button size="lg" className="w-full sm:w-auto flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Create a Dinner
              </Button>
            </Link>
            <Link to="/explore">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Browse Events
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
