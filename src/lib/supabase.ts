import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Supabase Configuration Check:');
console.log('   URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('   Anon Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing');

// Create a mock client if environment variables are missing
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('🚫 Supabase environment variables not found. Using mock client.');
    console.warn('📝 Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
    
    // Return a mock client for development
    return {
      auth: {
        getSession: () => {
          console.log('Mock: getSession called');
          return Promise.resolve({ data: { session: null }, error: null });
        },
        onAuthStateChange: (callback: any) => {
          console.log('Mock: onAuthStateChange called');
          setTimeout(() => callback('SIGNED_OUT', null), 100);
          return { data: { subscription: { unsubscribe: () => console.log('Mock: unsubscribed') } } };
        },
        signInWithPassword: ({ email, password }: any) => {
          console.log('Mock: signInWithPassword called with:', email);
          return Promise.resolve({ 
            data: null, 
            error: { message: 'Please configure Supabase environment variables to enable authentication' } 
          });
        },
        signUp: ({ email, password, options }: any) => {
          console.log('Mock: signUp called with:', email);
          return Promise.resolve({ 
            data: null, 
            error: { message: 'Please configure Supabase environment variables to enable authentication' } 
          });
        },
        signOut: () => {
          console.log('Mock: signOut called');
          return Promise.resolve({ error: null });
        },
      }
    };
  }
  
  console.log('🚀 Creating Supabase client for authentication only');
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createSupabaseClient();