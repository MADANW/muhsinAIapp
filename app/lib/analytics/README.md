/**
 * README.md - MuhsinAI Analytics Integration
 * 
 * This document provides an overview of the analytics integration
 * implemented in the MuhsinAI app.
 */

# MuhsinAI Analytics Integration

## Overview

The analytics system in MuhsinAI is designed to track user interactions and app usage,
helping us understand how users engage with the app and inform future development decisions.

## Implementation

The analytics system consists of several key components:

### Core Analytics Service (`app/lib/analytics/index.ts`)

The core analytics service provides a foundation for tracking events throughout the app.
Key features include:

- Event tracking with standardized event types
- User identification
- Debug mode for development
- Expandable architecture for future third-party analytics integrations

### React Hooks (`app/lib/analytics/analytics.hooks.ts`)

Custom React hooks make it easy to integrate analytics into components:

- `useScreenTracking`: Automatically tracks screen views
- `useAppLifecycleTracking`: Tracks app open/background events
- `useAnalyticsUser`: Sets user identity when auth state changes
- `usePlanAnalytics`: Provides specialized methods for tracking plan-related events
- `useSubscriptionAnalytics`: Tracks subscription and paywall events
- `useTrackFeatureUsage`: Convenience hook for tracking feature usage

### Provider Component (`app/lib/analytics/analytics.provider.tsx`)

The `AnalyticsProvider` component initializes the analytics service and handles
global events like:

- App lifecycle events
- Authentication state changes
- Automatic screen tracking

## Usage

### Basic Event Tracking

```tsx
import { analytics, AnalyticsEvent } from './lib/analytics';

// Track a simple event
analytics.track(AnalyticsEvent.FEATURE_USED, {
  feature_name: 'share_plan',
  source: 'plan_detail'
});
```

### Using Analytics Hooks

```tsx
import { usePlanAnalytics } from './lib/analytics/analytics.hooks';

function PlanScreen() {
  const planAnalytics = usePlanAnalytics();
  
  const handleGeneratePlan = async () => {
    // Track that user requested a plan
    planAnalytics.trackPlanRequested(prompt);
    
    // Generate plan...
    
    // Track successful generation
    planAnalytics.trackPlanGenerated(planId);
  };
  
  return (/* ... */);
}
```

### Automatic Screen Tracking

Screen views are automatically tracked via the `useScreenTracking` hook, which is used
in the `AnalyticsProvider`. You can also use it directly in components for custom screens:

```tsx
import { useScreenTracking } from './lib/analytics/analytics.hooks';

function CustomScreen() {
  // Override the screen name and add custom properties
  useScreenTracking('custom_screen', { property: 'value' });
  
  return (/* ... */);
}
```

## Future Enhancements

The current implementation provides a solid foundation that can be expanded to include:

1. Integration with third-party analytics providers like Firebase Analytics, PostHog, or Segment
2. User funnels and conversion tracking
3. Custom user properties and cohorts
4. A/B testing framework
5. Crash and error reporting

## Privacy Considerations

The analytics system is designed with privacy in mind:

- No personally identifiable information is collected beyond necessary user IDs
- All data collection complies with relevant privacy regulations
- Analytics can be disabled in the future via user preferences

## Maintenance

When adding new features to the app, consider adding appropriate analytics events to track usage.
Follow the established patterns and use the existing hooks when possible.