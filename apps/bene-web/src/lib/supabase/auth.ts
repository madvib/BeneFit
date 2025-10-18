'use server'

import { createClient } from '@/lib/supabase/server';

export async function getCurrentUser() {
  const supabase = await createClient();
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error('Error getting user:', error);
    return { user: null, error };
  }

  return { user, error: null };
}

export async function getUserSession() {
  const supabase = await createClient();
  
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error('Error getting session:', error);
    return { session: null, error };
  }

  return { session, error: null };
}

export async function signOutUser() {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}