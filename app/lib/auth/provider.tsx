import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useStore } from '../store';
import { getCurrentUser, getSession, signInWithApple, signInWithGoogle, supabase } from './client';

// Define the Auth Context types
type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string) => Promise<{ success: boolean; error?: any }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: any }>;
  signInWithApple: () => Promise<{ success: boolean; error?: any }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

// Create the Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { resetUsage } = useStore();

  // Load session and user on mount
  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      try {
        const session = await getSession();
        setSession(session);
        
        if (session) {
          const user = await getCurrentUser();
          setUser(user);

          // If we have a user, ensure they have a profile
          if (user) {
            await ensureProfile(user);
          }
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);

        if (event === 'SIGNED_IN' && session?.user) {
          // Ensure user has a profile
          await ensureProfile(session.user);
          
          try {
            // Import RevenueCat dynamically to avoid circular dependencies
            const { setUserId } = await import('../purchases/index');
            // Set RevenueCat user ID to track subscriptions
            await setUserId(session.user.id);
          } catch (error) {
            console.error('Failed to set RevenueCat user ID:', error);
          }
        }

        if (event === 'SIGNED_OUT') {
          // Reset local state when user signs out
          resetUsage();
          
          try {
            // Import RevenueCat dynamically to avoid circular dependencies
            const { resetUserId } = await import('../purchases/index');
            // Reset RevenueCat user ID when signing out
            await resetUserId();
          } catch (error) {
            console.error('Failed to reset RevenueCat user ID:', error);
          }
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [resetUsage]);

  // Ensure user has a profile record in the database
  const ensureProfile = async (user: User) => {
    try {
      // Check if profile exists
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (error || !profile) {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            tier: 'free', // Default to free tier
          });

        if (insertError) {
          console.error('Error creating profile:', insertError);
        }

        // Initialize usage record
        await supabase
          .from('usage')
          .insert({
            user_id: user.id,
            total_requests: 0,
          })
          .single();
      }

      // Hydrate store from DB
      await hydrateStoreFromDB(user.id);
    } catch (error) {
      console.error('Error ensuring profile:', error);
    }
  };

  // Hydrate store from database
  const hydrateStoreFromDB = async (userId: string) => {
    try {
      const { data: usageData } = await supabase
        .from('usage')
        .select('total_requests')
        .eq('user_id', userId)
        .single();

      const { data: profileData } = await supabase
        .from('profiles')
        .select('tier')
        .eq('id', userId)
        .single();

      if (usageData) {
        // Update local store with usage count from DB
        useStore.getState().setUsageCount(usageData.total_requests);
      }

      if (profileData) {
        // Update isPro based on tier
        const isPro = profileData.tier === 'pro';
        useStore.getState().setPro(isPro);
      }
    } catch (error) {
      console.error('Error hydrating store from DB:', error);
    }
  };

  // Sign in with magic link
  const signIn = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // You can customize email settings here
          emailRedirectTo: 'muhsinai://', // Deep link back to the app
        },
      });

      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error signing in:', error);
      return { success: false, error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Refresh session
  const refreshSession = async () => {
    setIsLoading(true);
    try {
      const session = await getSession();
      setSession(session);
      
      if (session) {
        const user = await getCurrentUser();
        setUser(user);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signInWithGoogle,
        signInWithApple,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the Auth Context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}