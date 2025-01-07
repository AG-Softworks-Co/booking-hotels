import { supabase } from '../supabase';
import type { AuthResponse } from './types';
import { getAuthErrorMessage } from './errors';

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        data: null,
        error: {
          message: getAuthErrorMessage(error),
          status: error.status
        }
      };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: getAuthErrorMessage(error),
        status: error?.status
      }
    };
  }
}

export async function signUp(
  email: string, 
  password: string, 
  hotelName: string
): Promise<AuthResponse> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { hotel_name: hotelName },
      },
    });

    if (authError) {
      return {
        data: null,
        error: {
          message: getAuthErrorMessage(authError),
          status: authError.status
        }
      };
    }

    return { data: authData, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: getAuthErrorMessage(error),
        status: error?.status
      }
    };
  }
}

export async function signOut(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return {
        data: null,
        error: {
          message: getAuthErrorMessage(error),
          status: error.status
        }
      };
    }

    return { data: null, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: getAuthErrorMessage(error),
        status: error?.status
      }
    };
  }
}