
import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { EmailOtpForm } from '@/components/auth/EmailOtpForm';
import { PhoneOtpForm } from '@/components/auth/PhoneOtpForm';
import { PasswordForm } from '@/components/auth/PasswordForm';
import { EmailSentConfirmation } from '@/components/auth/EmailSentConfirmation';
import { OtpVerification } from '@/components/auth/OtpVerification';

const Login = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sentCode, setSentCode] = useState(false);
  const [method, setMethod] = useState<'email' | 'phone' | 'password'>('email');
  
  const { isLoading } = useAuth();
  
  const handleEmailSubmit = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setSentCode(true);
  };
  
  const handlePhoneSubmit = (submittedPhone: string) => {
    setPhone(submittedPhone);
    setSentCode(true);
  };
  
  const handleBackClick = () => {
    setSentCode(false);
  };
  
  return (
    <div className="container-custom py-12 max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Verify Your Identity</CardTitle>
          <CardDescription>
            {method === 'email' 
              ? 'No passwords needed! We\'ll send you a secure login link via email.'
              : method === 'phone'
              ? 'No passwords needed! We\'ll send you a one-time code to verify your identity.'
              : 'Login with your email and password.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!sentCode ? (
            <Tabs defaultValue="email" onValueChange={(value) => setMethod(value as 'email' | 'phone' | 'password')}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="email">Email OTP</TabsTrigger>
                <TabsTrigger value="phone">Phone OTP</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
                <EmailOtpForm onEmailSubmit={handleEmailSubmit} />
              </TabsContent>
              
              <TabsContent value="phone">
                <PhoneOtpForm onPhoneSubmit={handlePhoneSubmit} />
              </TabsContent>
              
              <TabsContent value="password">
                <PasswordForm />
              </TabsContent>
            </Tabs>
          ) : (
            method === 'email' ? (
              <EmailSentConfirmation 
                email={email} 
                onBackClick={handleBackClick}
                isLoading={isLoading}
              />
            ) : (
              <OtpVerification 
                phone={phone} 
                onBackClick={handleBackClick} 
              />
            )
          )}
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
