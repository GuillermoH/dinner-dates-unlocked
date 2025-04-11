
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, PlusCircle, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Community } from '@/types';

const Communities = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: communities, isLoading, error } = useQuery({
    queryKey: ['communities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Community[];
    },
    enabled: !!user,
  });

  const navigateToCommunity = (id: string) => {
    navigate(`/community/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p>Error loading communities: {(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Communities</h1>
        <Button className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          Create Community
        </Button>
      </div>

      {communities && communities.length === 0 ? (
        <div className="text-center p-12 bg-muted rounded-lg">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No communities found</h3>
          <p className="text-muted-foreground mb-6">There are no communities to display right now.</p>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Your First Community
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities?.map((community) => (
            <Card 
              key={community.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigateToCommunity(community.id)}
            >
              <CardHeader>
                <CardTitle>{community.name}</CardTitle>
                <CardDescription>{community.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {community.members?.length || 0} members
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  navigateToCommunity(community.id);
                }}>
                  View Events
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Communities;
