/**
 * analytics.provider.tsx
 * 
 * Provider component for initializing analytics throughout the app
 */

import React, { createContext, useContext, useEffect } from 'react';
import { analytics, AnalyticsEvent } from './index';
import { useAppLifecycleTracking, useScreenTracking } from './analytics.hooks';
import { useAuth } from '../auth/provider';

// Create context
type AnalyticsContextType = {
  initialized: boolean;
};

const AnalyticsContext = createContext<AnalyticsContextType>({
  initialized: false,
});

// Props for the provider component
interface AnalyticsProviderProps {
  children: React.ReactNode;
  debug?: boolean;
}

/**
 * Provider component to initialize analytics and track global events
 */
export function AnalyticsProvider({ children, debug = false }: AnalyticsProviderProps) {
  const { user } = useAuth();
  
  // Initialize analytics on mount
  useEffect(() => {
    analytics.initialize({ debug });
    
    // Track app opened
    analytics.track(AnalyticsEvent.APP_OPENED);
    
    // Clean up on unmount
    return () => {
      analytics.track(AnalyticsEvent.APP_BACKGROUNDED);
    };
  }, [debug]);
  
  // Update user identity when auth state changes
  useEffect(() => {
    if (user) {
      analytics.identify(user.id, {
        email: user.email,
        auth_provider: user.app_metadata?.provider || 'email',
        created_at: user.created_at,
      });
      
      // Track sign in if this is a new session
      if (!analytics.userId) {
        analytics.track(AnalyticsEvent.SIGN_IN_COMPLETED, {
          provider: user.app_metadata?.provider || 'email',
        });
      }
    } else {
      analytics.reset();
    }
  }, [user]);
  
  // Track app lifecycle events
  useAppLifecycleTracking();
  
  // Track screen views globally
  useScreenTracking();
  
  return (
    <AnalyticsContext.Provider value={{ initialized: true }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

/**
 * Hook to access analytics context
 */
export function useAnalytics() {
  return useContext(AnalyticsContext);
}