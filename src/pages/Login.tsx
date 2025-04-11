
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const Login = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sentCode, setSentCode] = useState(false);
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  
  const { signInWithOtp, verifyOtp, isLoading } = useAuth();
  
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (method === 'email') {
      await signInWithOtp(email, undefined);
    } else {
      await signInWithOtp(undefined, phone);
    }
    
    setSentCode(true);
  };
  
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (method === 'email') {
      await verifyOtp(email, undefined, code);
    } else {
      await verifyOtp(undefined, phone, code);
    }
  };
  
  return (
    <div className="container-custom py-12 max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Verify Your Identity</CardTitle>
          <CardDescription>
            {method === 'email' 
              ? 'No passwords needed! We\'ll send you a secure login link via email.'
              : 'No passwords needed! We\'ll send you a one-time code to verify your identity.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!sentCode ? (
            <Tabs defaultValue="email" onValueChange={(value) => setMethod(value as 'email' | 'phone')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
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
              </TabsContent>
              
              <TabsContent value="phone">
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
              </TabsContent>
            </Tabs>
          ) : (
            method === 'email' ? (
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
                  onClick={() => setSentCode(false)}
                  disabled={isLoading}
                >
                  Use a different email or phone
                </Button>
              </div>
            ) : (
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
                    onClick={() => setSentCode(false)}
                    disabled={isLoading}
                  >
                    Use a different email or phone
                  </Button>
                </div>
              </form>
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
