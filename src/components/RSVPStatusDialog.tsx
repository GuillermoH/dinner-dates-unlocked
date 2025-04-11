
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Check, HelpCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { RSVPStatus } from '@/types';

interface RSVPStatusDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, email: string, status: RSVPStatus) => Promise<{ success: boolean, error?: any }>;
  eventIsPaid?: boolean;
  eventPrice?: number;
}

const RSVPStatusDialog: React.FC<RSVPStatusDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  eventIsPaid,
  eventPrice
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<RSVPStatus>('going');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await onSubmit(name, email, status);
      
      if (result.success) {
        toast.success(`RSVP successful!${status === 'going' ? ' Check your email for confirmation.' : ''}`);
        onOpenChange(false);
        // Reset form
        setName('');
        setEmail('');
        setStatus('going');
      } else {
        toast.error("Failed to submit RSVP. Please try again.");
      }
    } catch (error) {
      console.error('RSVP error:', error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>RSVP to this event</DialogTitle>
          <DialogDescription>
            Let the host know if you're planning to attend.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
          
          <div className="space-y-2">
            <Label>Will you attend?</Label>
            <RadioGroup
              value={status}
              onValueChange={(value) => setStatus(value as RSVPStatus)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="going" id="going" />
                <Label htmlFor="going" className="flex items-center gap-2 cursor-pointer">
                  <Check className="h-4 w-4 text-green-500" />
                  Yes, I'll be there
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="maybe" id="maybe" />
                <Label htmlFor="maybe" className="flex items-center gap-2 cursor-pointer">
                  <HelpCircle className="h-4 w-4 text-amber-500" />
                  Maybe
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not_going" id="not_going" />
                <Label htmlFor="not_going" className="flex items-center gap-2 cursor-pointer">
                  <X className="h-4 w-4 text-red-500" />
                  No, I can't make it
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {eventIsPaid && status === 'going' && (
            <div className="text-sm text-muted-foreground mt-4 p-3 bg-muted rounded-md">
              <p>This is a paid event. After RSVP, you'll receive payment instructions. The cost is ${eventPrice}.</p>
            </div>
          )}
          
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Confirm RSVP"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RSVPStatusDialog;
