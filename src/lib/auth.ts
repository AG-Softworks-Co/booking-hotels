import { supabase } from './supabase';


export type AuthError = {
  message: string;
  status?: number;
};

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw { message: error.message, status: error.status };
    }

    return { data, error: null };
  } catch (error) {
    const authError = error as AuthError;
    return {
      data: null,
      error: {
        message: authError.message || 'An error occurred during sign in',
        status: authError.status,
      },
    };
  }
}

export async function signUp(email: string, password: string, hotelName: string) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { hotel_name: hotelName },
      },
    });

    if (authError) throw authError;

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          hotel_name: hotelName,
          email: email,
        });

      if (profileError) throw profileError;
    }

    return { data: authData, error: null };
  } catch (error) {
    const authError = error as AuthError;
    return {
      data: null,
      error: {
        message: authError.message || 'An error occurred during registration',
        status: authError.status,
      },
    };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    const authError = error as AuthError;
    return {
      error: {
        message: authError.message || 'An error occurred during sign out',
        status: authError.status,
      },
    };
  }
}