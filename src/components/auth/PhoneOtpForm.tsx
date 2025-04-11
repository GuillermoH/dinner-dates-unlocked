
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PhoneOtpFormProps {
  onPhoneSubmit: (phone: string) => void;
}

export const PhoneOtpForm: React.FC<PhoneOtpFormProps> = ({ onPhoneSubmit }) => {
  const [phone, setPhone] = useState('');
  const { signInWithOtp, isLoading } = useAuth();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    await signInWithOtp(undefined, phone);
    onPhoneSubmit(phone);
  };

  return (
    <form onSubmit={handleSendCode}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              id="phone"
              type="tel"
              placeholder="+1 (123) 456-7890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-10"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            We&apos;ll send a verification code via SMS to this number. Please include the country code.
          </p>
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Verification Code'}
        </Button>
      </div>
    </form>
  );
};
