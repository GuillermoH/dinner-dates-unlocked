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
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      toast.success('Successfully logged in!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      console.error('Error signing in with password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithPassword = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        throw error;
      }

      toast.success('Registration successful! Please check your email for verification.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
      console.error('Error signing up with password:', error);
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
