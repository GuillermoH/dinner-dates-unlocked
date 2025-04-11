
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
import { ArrowRight, Mail, Phone, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const Login = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sentCode, setSentCode] = useState(false);
  const [method, setMethod] = useState<'email' | 'phone' | 'password'>('email');
  const [isSignUp, setIsSignUp] = useState(false);
  
  const { signInWithOtp, verifyOtp, signInWithPassword, signUpWithPassword, isLoading } = useAuth();
  
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

  // Define the form schema for password login/signup
  const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isSignUp) {
      await signUpWithPassword(values.email, values.password);
    } else {
      await signInWithPassword(values.email, values.password);
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
              : method === 'phone'
              ? 'No passwords needed! We\'ll send you a one-time code to verify your identity.'
              : isSignUp
              ? 'Create an account with email and password.'
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
              
              <TabsContent value="password">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input 
                                placeholder="your.email@example.com" 
                                className="pl-10"
                                {...field} 
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                className="pl-10"
                                {...field} 
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-between items-center">
                      <Button
                        type="button"
                        variant="link"
                        className="px-0"
                        onClick={() => setIsSignUp(!isSignUp)}
                      >
                        {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
                      </Button>
                    </div>
                  </form>
                </Form>
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
