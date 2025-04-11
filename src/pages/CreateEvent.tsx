
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';
import { EventVisibility } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { isValidVisibility } from '@/utils/typeGuards';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const communityId = searchParams.get('communityId');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: 10,
    visibility: 'public' as EventVisibility,
    isPaid: false,
    price: 0,
    communityId: communityId || '',
  });
  
  useEffect(() => {
    if (!user) {
      toast.error('You must be logged in to create an event');
      navigate('/login');
    }
  }, [user, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create an event');
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      
      if (isNaN(dateTime.getTime())) {
        throw new Error('Invalid date or time');
      }
      
      const visibility = isValidVisibility(formData.visibility) 
        ? formData.visibility 
        : 'public';
      
      // Get the user's profile to access their name
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.warn('Could not fetch user profile:', profileError);
      }
      
      const hostName = profileData?.name || user.email || user.phone || 'Anonymous Host';
      
      const eventData = {
        title: formData.title,
        description: formData.description,
        date_time: dateTime.toISOString(),
        location: formData.location,
        capacity: formData.capacity,
        visibility: visibility,
        host_id: user.id,
        host_name: hostName,
        attendees: [],
        waitlist: [],
        is_paid: formData.isPaid,
        price: formData.isPaid ? formData.price : null,
        community_id: formData.communityId || null,
      };
      
      const { data, error } = await supabase
        .from('events')
        .insert(eventData)
        .select('id')
        .single();
      
      if (error) throw error;
      
      toast.success('Event created successfully!');
      
      navigate(`/event/${data.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(`Failed to create event: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container-custom py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create a Small Group Dinner</h1>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>
                Fill out the information below to create your small group dinner.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Give your dinner a name"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="What's this dinner about? What should attendees know?"
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-32"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="relative">
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="pl-10"
                    />
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Where will this dinner take place?"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min={2}
                    max={50}
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 6-12 people for best conversations
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select 
                    value={formData.visibility} 
                    onValueChange={(value) => handleSelectChange('visibility', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private (invitation only)</SelectItem>
                      {formData.communityId && (
                        <SelectItem value="community">Community</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPaid"
                    checked={formData.isPaid}
                    onChange={(e) => setFormData({
                      ...formData,
                      isPaid: e.target.checked
                    })}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="isPaid">This is a paid event</Label>
                </div>
                
                {formData.isPaid && (
                  <div className="ml-6 space-y-2">
                    <Label htmlFor="price">Price per person ($)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min={0}
                      step={0.01}
                      value={formData.price}
                      onChange={handleChange}
                      required={formData.isPaid}
                    />
                    <p className="text-xs text-muted-foreground">
                      You'll receive payment instructions for collecting via Venmo
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter>
              <div className="flex justify-end gap-4 w-full">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Event'}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateEvent;
