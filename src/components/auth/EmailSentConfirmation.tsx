
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

interface EmailSentConfirmationProps {
  email: string;
  onBackClick: () => void;
  isLoading: boolean;
}

export const EmailSentConfirmation: React.FC<EmailSentConfirmationProps> = ({ 
  email, 
  onBackClick,
  isLoading 
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <Mail className="mx-auto h-12 w-12 text-primary" />
        <h3 className="text-lg font-medium">Check your email</h3>
        <p className="text-muted-foreground">
          We&apos;ve sent a magic link to <span className="font-medium">{email}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Click the link in the email to sign in automatically. If you don&apos;t see it, check your spam folder.
        </p>
      </div>
      
      <Button 
        type="button" 
        variant="outline" 
        className="w-full text-sm"
        onClick={onBackClick}
        disabled={isLoading}
      >
        Use a different email or phone
      </Button>
    </div>
  );
};
