
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithOtp: (email?: string, phone?: string) => Promise<void>;
  verifyOtp: (email: string | undefined, phone: string | undefined, token: string) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUpWithPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        console.log("Auth state changed:", session ? "Logged in" : "Logged out");
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "Session found" : "No session");
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithOtp = async (email?: string, phone?: string) => {
    setIsLoading(true);
    try {
      let result;
      
      if (email) {
        result = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true
          }
        });
      } else if (phone) {
        result = await supabase.auth.signInWithOtp({
          phone,
          options: {
            shouldCreateUser: true
          }
        });
      } else {
        throw new Error('Either email or phone is required');
      }

      if (result.error) {
        throw result.error;
      }
      
      toast.success('Verification code sent!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send verification code');
      console.error('Error sending OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string | undefined, phone: string | undefined, token: string) => {
    setIsLoading(true);
    try {
      let verifyResult;
      
      if (email) {
        verifyResult = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'email'
        });
      } 
      else if (phone) {
        verifyResult = await supabase.auth.verifyOtp({
          phone,
          token,
          type: 'sms'
        });
      } else {
        throw new Error('Either email or phone is required for verification');
      }

      if (verifyResult.error) {
        throw verifyResult.error;
      }

      toast.success('Successfully logged in!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify code');
      console.error('Error verifying OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithPassword = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting to sign in with:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Sign in error details:", error);
        throw error;
      }

      console.log("Sign in successful, user:", data.user);
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (error: any) {
      console.error("Error signing in with password:", error);
      
      // Provide more specific error messages based on error type
      if (error.message === "Invalid login credentials") {
        toast.error('Invalid email or password. Please check your credentials and try again.');
      } else {
        toast.error(error.message || 'Failed to sign in');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithPassword = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting to sign up with:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        console.error("Sign up error details:", error);
        throw error;
      }

      console.log("Sign up response:", data);
      
      // Check if user is new or already exists
      if (data?.user && data.session) {
        // User was created and is signed in
        toast.success('Registration successful! You are now logged in.');
        navigate('/');
      } else if (data?.user) {
        // User was created but needs email confirmation
        toast.success('Registration successful! Please check your email for verification.');
      } else {
        toast.info('Please check your email to continue the registration process.');
      }
    } catch (error: any) {
      console.error("Error signing up with password:", error);
      
      // Provide more specific error messages based on error code
      if (error.message.includes("already registered")) {
        toast.error('This email is already registered. Please try logging in instead.');
      } else {
        toast.error(error.message || 'Failed to sign up');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Successfully logged out');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading,
      signInWithOtp,
      verifyOtp,
      signInWithPassword,
      signUpWithPassword,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
