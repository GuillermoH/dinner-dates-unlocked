
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface OtpVerificationProps {
  phone: string;
  onBackClick: () => void;
}

export const OtpVerification: React.FC<OtpVerificationProps> = ({ phone, onBackClick }) => {
  const [code, setCode] = useState('');
  const { verifyOtp, isLoading } = useAuth();

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyOtp(undefined, phone, code);
  };

  return (
    <form onSubmit={handleVerifyCode}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Verification Code</Label>
          <div className="flex justify-center py-2">
            <InputOTP 
              maxLength={6}
              value={code}
              onChange={setCode}
              required
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Enter the code we sent to {phone}
          </p>
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading || code.length !== 6}
        >
          {isLoading ? 'Verifying...' : 'Verify Code'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        
        <Button 
          type="button" 
          variant="link" 
          className="w-full text-sm"
          onClick={onBackClick}
          disabled={isLoading}
        >
          Use a different email or phone
        </Button>
      </div>
    </form>
  );
};
