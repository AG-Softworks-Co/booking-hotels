import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as authService from '@/lib/auth/auth-service';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await authService.signIn(email, password);
      
      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Successfully logged in');
      navigate('/dashboard');
      return true;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const signUp = useCallback(async (email: string, password: string, hotelName: string) => {
    setIsLoading(true);
    try {
      const { error } = await authService.signUp(email, password, hotelName);
      
      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Registration successful! Please sign in.');
      navigate('/login');
      return true;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      const { error } = await authService.signOut();
      
      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Successfully logged out');
      navigate('/login');
      return true;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  return {
    isLoading,
    signIn,
    signUp,
    signOut,
  };
}