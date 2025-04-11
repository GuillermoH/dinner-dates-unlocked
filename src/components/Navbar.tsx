
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container-custom mx-auto py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
            SGDs
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <div className="flex gap-3">
                <Link to="/create-event">
                  <Button className="flex items-center gap-1">
                    <PlusCircle className="h-4 w-4" />
                    Create SGD
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
              </div>
            </div>
            
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>
                      Access quick actions and navigation.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 mt-6">
                    <Link to="/">
                      <Button variant="ghost" className="w-full justify-start">Home</Button>
                    </Link>
                    <Link to="/create-event">
                      <Button className="w-full justify-start flex items-center gap-1">
                        <PlusCircle className="h-4 w-4" />
                        Create SGD
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" className="w-full justify-start">Login</Button>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
