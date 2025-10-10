/**
 * analytics.hooks.ts
 * 
 * Custom React hooks for analytics integration.
 */

import { useEffect } from 'react';
import { analytics, AnalyticsEvent } from './index';
import { usePathname } from 'expo-router';

/**
 * Hook to automatically track screen views
 * @param screenName Optional screen name override
 * @param properties Additional properties to track with the screen view
 */
export function useScreenTracking(
  screenName?: string,
  properties?: Record<string, any>
) {
  const pathname = usePathname();
  
  useEffect(() => {
    // Use provided screen name or derive it from pathname
    const name = screenName || pathname?.replace(/^\/+/, '') || 'unknown';
    analytics.trackScreen(name, properties);
  }, [pathname, screenName, properties]);
}

/**
 * Hook to track app lifecycle events
 */
export function useAppLifecycleTracking() {
  useEffect(() => {
    // Track app opened on mount
    analytics.track(AnalyticsEvent.APP_OPENED);
    
    return () => {
      // Track app backgrounded on unmount
      // Note: This is not a perfect solution as it won't catch force quits
      analytics.track(AnalyticsEvent.APP_BACKGROUNDED);
    };
  }, []);
}

/**
 * Hook to initialize analytics with the current user
 * @param userId The current user ID
 * @param userProperties Additional user properties
 */
export function useAnalyticsUser(
  userId: string | null | undefined,
  userProperties?: Record<string, any>
) {
  useEffect(() => {
    if (userId) {
      analytics.identify(userId, userProperties);
    } else {
      analytics.reset();
    }
  }, [userId, userProperties]);
}

/**
 * Convenience hook to track a feature usage
 * @returns A function to track feature usage
 */
export function useTrackFeatureUsage() {
  return (featureName: string, properties?: Record<string, any>) => {
    analytics.track(AnalyticsEvent.FEATURE_USED, {
      feature_name: featureName,
      ...properties
    });
  };
}

/**
 * Hook for tracking plan-related actions
 * @returns Functions for tracking plan events
 */
export function usePlanAnalytics() {
  return {
    trackPlanRequested: (prompt: string, properties?: Record<string, any>) => {
      analytics.track(AnalyticsEvent.PLAN_REQUESTED, {
        prompt,
        ...properties
      });
    },
    
    trackPlanGenerated: (planId: string, properties?: Record<string, any>) => {
      analytics.track(AnalyticsEvent.PLAN_GENERATED, {
        plan_id: planId,
        ...properties
      });
    },
    
    trackPlanError: (error: string, properties?: Record<string, any>) => {
      analytics.track(AnalyticsEvent.PLAN_ERROR, {
        error,
        ...properties
      });
    },
    
    trackPlanViewed: (planId: string, properties?: Record<string, any>) => {
      analytics.track(AnalyticsEvent.PLAN_VIEWED, {
        plan_id: planId,
        ...properties
      });
    }
  };
}

/**
 * Hook for tracking subscription-related actions
 * @returns Functions for tracking subscription events
 */
export function useSubscriptionAnalytics() {
  return {
    trackPaywallViewed: (source?: string, properties?: Record<string, any>) => {
      analytics.track(AnalyticsEvent.PAYWALL_VIEWED, {
        source,
        ...properties
      });
    },
    
    trackSubscriptionStarted: (tier?: string, properties?: Record<string, any>) => {
      analytics.track(AnalyticsEvent.SUBSCRIPTION_STARTED, {
        tier,
        ...properties
      });
    },
    
    trackSubscriptionCompleted: (tier: string, properties?: Record<string, any>) => {
      analytics.track(AnalyticsEvent.SUBSCRIPTION_COMPLETED, {
        tier,
        ...properties
      });
    },
    
    trackSubscriptionError: (error: string, properties?: Record<string, any>) => {
      analytics.track(AnalyticsEvent.SUBSCRIPTION_ERROR, {
        error,
        ...properties
      });
    }
  };
}