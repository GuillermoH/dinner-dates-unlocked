
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface EmailOtpFormProps {
  onEmailSubmit: (email: string) => void;
}

export const EmailOtpForm: React.FC<EmailOtpFormProps> = ({ onEmailSubmit }) => {
  const [email, setEmail] = useState('');
  const { signInWithOtp, isLoading } = useAuth();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    await signInWithOtp(email, undefined);
    onEmailSubmit(email);
  };

  return (
    <form onSubmit={handleSendCode}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">University Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              id="email"
              type="email"
              placeholder="your.name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            We&apos;ll send a secure login link to this email address.
          </p>
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Login Link'}
        </Button>
      </div>
    </form>
  );
};
