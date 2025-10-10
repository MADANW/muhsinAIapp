/**
 * animations.ts
 * 
 * Reusable animation utilities for consistent animations throughout the app
 */

import { Animated, Easing } from 'react-native';

/**
 * Standard timing configurations for animations
 */
export const timings = {
  fast: 200,
  medium: 300,
  slow: 500,
  extraSlow: 800
};

/**
 * Standard easing configurations for animations
 */
export const easings = {
  standard: Easing.inOut(Easing.ease),
  bounce: Easing.bounce,
  elastic: Easing.elastic(1),
  decelerate: Easing.out(Easing.cubic)
};

/**
 * Fade in animation for components
 * @param value The Animated.Value to animate
 * @param duration How long the animation should take
 * @param delay Optional delay before starting animation
 * @param callback Optional callback when animation completes
 */
export const fadeIn = (
  value: Animated.Value,
  duration = timings.medium,
  delay = 0,
  callback?: () => void
): Animated.CompositeAnimation => {
  return Animated.timing(value, {
    toValue: 1,
    duration,
    delay,
    useNativeDriver: true,
    easing: easings.standard
  });
};

/**
 * Fade out animation for components
 * @param value The Animated.Value to animate
 * @param duration How long the animation should take
 * @param delay Optional delay before starting animation
 * @param callback Optional callback when animation completes
 */
export const fadeOut = (
  value: Animated.Value,
  duration = timings.medium,
  delay = 0,
  callback?: () => void
): Animated.CompositeAnimation => {
  return Animated.timing(value, {
    toValue: 0,
    duration,
    delay,
    useNativeDriver: true,
    easing: easings.standard
  });
};

/**
 * Scale animation for components
 * @param value The Animated.Value to animate
 * @param toValue The target scale value
 * @param duration How long the animation should take
 * @param delay Optional delay before starting animation
 * @param callback Optional callback when animation completes
 */
export const scale = (
  value: Animated.Value,
  toValue: number,
  duration = timings.medium,
  delay = 0,
  callback?: () => void
): Animated.CompositeAnimation => {
  return Animated.timing(value, {
    toValue,
    duration,
    delay,
    useNativeDriver: true,
    easing: easings.standard
  });
};

/**
 * Translate animation for components
 * @param value The Animated.Value to animate
 * @param toValue The target translation value
 * @param duration How long the animation should take
 * @param delay Optional delay before starting animation
 * @param callback Optional callback when animation completes
 */
export const translate = (
  value: Animated.Value,
  toValue: number,
  duration = timings.medium,
  delay = 0,
  callback?: () => void
): Animated.CompositeAnimation => {
  return Animated.timing(value, {
    toValue,
    duration,
    delay,
    useNativeDriver: true,
    easing: easings.standard
  });
};

/**
 * Sequential animation to create a staggered effect
 * @param animations Array of animations to run in sequence
 * @param staggerDelay Delay between each animation
 */
export const staggered = (animations: Animated.CompositeAnimation[], staggerDelay = 100) => {
  return Animated.stagger(staggerDelay, animations).start();
};

/**
 * Animation for a bouncy effect - good for buttons or elements requiring attention
 * @param value The Animated.Value to animate
 * @param duration How long the animation should take
 */
export const bounce = (value: Animated.Value, duration = timings.medium) => {
  return Animated.sequence([
    Animated.timing(value, {
      toValue: 1.1,
      duration: duration * 0.4,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }),
    Animated.timing(value, {
      toValue: 1,
      duration: duration * 0.6,
      useNativeDriver: true,
      easing: Easing.bounce,
    }),
  ]).start();
};

/**
 * Pulse animation - good for notifications or elements requiring attention
 * @param value The Animated.Value to animate
 * @param iterations How many times to pulse (0 for infinite)
 */
export const pulse = (value: Animated.Value, iterations = 0) => {
  const pulseSequence = Animated.sequence([
    Animated.timing(value, {
      toValue: 1.1,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }),
    Animated.timing(value, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.in(Easing.ease),
    }),
  ]);

  if (iterations === 0) {
    return Animated.loop(pulseSequence).start();
  } else {
    return Animated.loop(pulseSequence, { iterations }).start();
  }
};