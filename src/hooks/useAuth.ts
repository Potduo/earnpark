import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if we're using mock client
  const isMockClient = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

  useEffect(() => {
    const init = async () => {
      try {
        console.log('🚀 Initializing auth...');
        
        if (isMockClient) {
          console.log('🚫 Using mock client - no authentication available');
          setError('Supabase not configured. Please set up environment variables.');
          setLoading(false);
          return;
        }

        console.log('✅ Supabase configured, getting session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('❌ Session fetch error:', sessionError);
          setError('Failed to get session');
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('✅ Found existing session for user:', session.user.email);
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            created_at: session.user.created_at || new Date().toISOString()
          };
          setUser(userData);
        } else {
          console.log('ℹ️ No existing session found');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('💥 Auth initialization error:', err);
        setError('Failed to initialize authentication');
        setLoading(false);
      }
    };

    init();

    if (isMockClient) {
      return () => {}; // No cleanup needed for mock client
    }

    console.log('👂 Setting up auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('✅ User signed in:', session.user.email);
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          created_at: session.user.created_at || new Date().toISOString()
        };
        setUser(userData);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out');
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (isMockClient) {
      return { error: { message: 'Please configure Supabase environment variables to enable authentication' } };
    }

    try {
      console.log('🔐 Attempting to sign in user:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('❌ Sign in error:', error);
        setLoading(false);
        return { error };
      }

      console.log('✅ Sign in successful for:', email);
      return { error: null };
    } catch (err) {
      console.error('💥 Unexpected sign in error:', err);
      setLoading(false);
      return { error: { message: 'Unexpected error during sign in' } };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (isMockClient) {
      return { data: null, error: { message: 'Please configure Supabase environment variables to enable authentication' } };
    }

    try {
      console.log('📝 Attempting to sign up user:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
        },
      });

      if (error) {
        console.error('❌ Sign up error:', error);
      } else {
        console.log('✅ Sign up successful for:', email);
      }

      return { data, error };
    } catch (err) {
      console.error('💥 Unexpected sign up error:', err);
      return { data: null, error: { message: 'Unexpected error during sign up' } };
    }
  };

  const signOut = async () => {
    if (isMockClient) {
      return { error: null };
    }

    console.log('👋 Signing out user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Sign out error:', error);
    } else {
      console.log('✅ Sign out successful');
    }
    return { error };
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
  };
};