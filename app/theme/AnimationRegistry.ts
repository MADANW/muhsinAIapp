/**
 * AnimationRegistry.ts
 * 
 * This file centralizes all animation imports and provides a clean API for accessing animations.
 * Register all Lottie animations here so they can be easily referenced throughout the app.
 * 
 * Note: You'll need to install lottie-react-native:
 * npx expo install lottie-react-native
 */

// Type for animation source
type AnimationSource = any; // For require('./path/to/animation.json')

interface AnimationRegistry {
  // Loading states
  loading: {
    default: AnimationSource;
    circular: AnimationSource;
  };
  
  // Success/completion states
  success: {
    checkmark: AnimationSource;
    confetti: AnimationSource;
  };
  
  // Feedback animations
  feedback: {
    error: AnimationSource;
    warning: AnimationSource;
  };
  
  // Feature animations
  features: {
    prayer: AnimationSource;
    planning: AnimationSource;
    email: AnimationSource;
  };
  
  // Empty states
  empty: {
    noPlans: AnimationSource;
    noResults: AnimationSource;
  };
}

// Comment out this code until the animations are actually available
// When you add Lottie animations, uncomment this section and update the paths

/*
export const Animations: AnimationRegistry = {
  loading: {
    default: require('../../assets/animations/loading.json'),
    circular: require('../../assets/animations/loading-circular.json'),
  },
  
  success: {
    checkmark: require('../../assets/animations/success-checkmark.json'),
    confetti: require('../../assets/animations/success-confetti.json'),
  },
  
  feedback: {
    error: require('../../assets/animations/error.json'),
    warning: require('../../assets/animations/warning.json'),
  },
  
  features: {
    prayer: require('../../assets/animations/prayer.json'),
    planning: require('../../assets/animations/planning.json'),
    email: require('../../assets/animations/email-sent.json'),
  },
  
  empty: {
    noPlans: require('../../assets/animations/no-plans.json'),
    noResults: require('../../assets/animations/no-results.json'),
  },
};
*/

/**
 * How to use:
 * 
 * import LottieView from 'lottie-react-native';
 * import { Animations } from '../path/to/AnimationRegistry';
 * 
 * // In your component:
 * <LottieView
 *   source={Animations.loading.default}
 *   autoPlay
 *   loop
 *   style={{ width: 100, height: 100 }}
 * />
 */

// Temporary placeholder until animations are added
export const Animations = {
  // This is just a placeholder to prevent errors
  // Replace with actual animations when available
};