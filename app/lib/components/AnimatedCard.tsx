/**
 * AnimatedCard.tsx
 * 
 * A reusable animated card component that includes entry animations
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import * as Animations from '../animations';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  delay?: number;
  duration?: number;
  index?: number; // For staggered animations in lists
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  style,
  delay = 0,
  duration = 300,
  index = 0
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const translateYAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    // Calculate delay based on index for staggered animations
    const staggeredDelay = delay + (index * 50);
    
    // Animate the component into view
    Animated.parallel([
      Animations.fadeIn(fadeAnim, duration, staggeredDelay),
      Animations.scale(scaleAnim, 1, duration, staggeredDelay),
      Animations.translate(translateYAnim, 0, duration, staggeredDelay)
    ]).start();
    
    return () => {
      // Reset animation values on unmount
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.95);
      translateYAnim.setValue(10);
    };
  }, [fadeAnim, scaleAnim, translateYAnim, delay, duration, index]);

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim }
          ]
        }
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  },
});

export default AnimatedCard;