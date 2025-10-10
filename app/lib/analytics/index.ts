/**
 * analytics.ts
 * 
 * A simple analytics service that can be expanded later to integrate
 * with platforms like PostHog, Firebase Analytics, or Segment.
 */

// Event types we want to track throughout the app
export enum AnalyticsEvent {
  // Plan-related events
  PLAN_REQUESTED = 'plan_requested',  
  PLAN_GENERATED = 'plan_generated',
  PLAN_ERROR = 'plan_error',
  PLAN_VIEWED = 'plan_viewed',
  
  // Subscription events
  PAYWALL_VIEWED = 'paywall_viewed',
  SUBSCRIPTION_STARTED = 'subscription_started',
  SUBSCRIPTION_COMPLETED = 'subscription_completed',
  SUBSCRIPTION_ERROR = 'subscription_error',
  SUBSCRIPTION_RESTORED = 'subscription_restored',
  
  // Authentication events
  SIGN_IN_STARTED = 'sign_in_started',
  SIGN_IN_COMPLETED = 'sign_in_completed',
  SIGN_IN_ERROR = 'sign_in_error',
  SIGN_OUT = 'sign_out',
  
  // App lifecycle events
  APP_OPENED = 'app_opened',
  APP_BACKGROUNDED = 'app_backgrounded',
  SCREEN_VIEWED = 'screen_viewed',
  
  // Feature usage
  FEATURE_USED = 'feature_used',
  SEARCH_PERFORMED = 'search_performed',
  EXTERNAL_LINK_OPENED = 'external_link_opened',
}

// Type for event properties
type EventProperties = Record<string, any>;

// Analytics service class
class AnalyticsService {
  private isInitialized = false;
  private _userId: string | null = null;
  private userProperties: Record<string, any> = {};
  private debug = false;
  
  // Getter for userId to allow external code to check if user is identified
  get userId(): string | null {
    return this._userId;
  }
  
  /**
   * Initialize the analytics service
   */
  initialize(options?: { debug?: boolean }) {
    this.debug = options?.debug || false;
    this.isInitialized = true;
    
    if (this.debug) {
      console.log('[Analytics] Initialized');
    }
    
    // In the future, initialize third-party analytics SDKs here
  }
  
  /**
   * Identify a user
   */
  identify(userId: string, userProperties?: Record<string, any>) {
    this._userId = userId;
    this.userProperties = userProperties || {};
    
    if (this.debug) {
      console.log(`[Analytics] Identified user ${userId}`, userProperties);
    }
    
    // In the future, set user ID in third-party analytics SDKs
  }
  
  /**
   * Reset user identity (e.g., on logout)
   */
  reset() {
    this._userId = null;
    this.userProperties = {};
    
    if (this.debug) {
      console.log('[Analytics] Reset user identity');
    }
    
    // In the future, reset user ID in third-party analytics SDKs
  }
  
  /**
   * Track an analytics event
   */
  track(event: AnalyticsEvent | string, properties?: EventProperties) {
    if (!this.isInitialized) {
      console.warn('[Analytics] Attempting to track event before initialization');
      return;
    }
    
    if (this.debug) {
      console.log(`[Analytics] Event: ${event}`, properties);
    }
    
    // In the future, track event with third-party analytics SDKs
  }
  
  /**
   * Track a screen view
   */
  trackScreen(screenName: string, properties?: EventProperties) {
    this.track(AnalyticsEvent.SCREEN_VIEWED, {
      screen_name: screenName,
      ...properties
    });
  }
  
  /**
   * Update user properties
   */
  updateUserProperties(properties: Record<string, any>) {
    this.userProperties = {
      ...this.userProperties,
      ...properties
    };
    
    if (this.debug) {
      console.log('[Analytics] Updated user properties', properties);
    }
    
    // In the future, update user properties in third-party analytics SDKs
  }
}

// Export a singleton instance
export const analytics = new AnalyticsService();