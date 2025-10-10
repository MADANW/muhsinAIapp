import React from 'react';
import {
    ActivityIndicator,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

// Button sizes
export type ButtonSize = 'small' | 'medium' | 'large';

// Button props
export interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}

/**
 * Button component
 * 
 * A customizable button component with different variants and states
 */
export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = useTheme();
  
  // Determine button style based on variant and state
  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];
  
  // Determine text style based on variant
  const buttonTextStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      {/* Left icon if provided */}
      {leftIcon && !loading && (
        <View style={styles.leftIcon}>{leftIcon}</View>
      )}
      
      {/* Loading indicator */}
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? colors.primary.contrast : colors.primary.main} 
          style={styles.loadingIndicator} 
        />
      )}
      
      {/* Button text */}
      <Text style={buttonTextStyle}>{title}</Text>
      
      {/* Right icon if provided */}
      {rightIcon && !loading && (
        <View style={styles.rightIcon}>{rightIcon}</View>
      )}
    </TouchableOpacity>
  );
};

// Create themed styles for the button
const getStyles = (theme: ReturnType<typeof useTheme>) => {
  const { colors, typography, borderRadius, spacing } = theme;
  
  return StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.medium,
    },
    // Variants
    primary: {
      backgroundColor: colors.primary.main,
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.primary.main,
    },
    tertiary: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    // Sizes
    small: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.m,
      minHeight: 36,
    },
    medium: {
      paddingVertical: spacing.s,
      paddingHorizontal: spacing.l,
      minHeight: 44,
    },
    large: {
      paddingVertical: spacing.m,
      paddingHorizontal: spacing.xl,
      minHeight: 52,
    },
    // Text styles
    text: {
      fontFamily: typography.fontFamily.primary,
      fontWeight: '500' as const, // Use string literal for font weight
      textAlign: 'center',
    },
    primaryText: {
      color: colors.primary.contrast,
    },
    secondaryText: {
      color: colors.primary.main,
    },
    tertiaryText: {
      color: colors.primary.main,
    },
    smallText: {
      fontSize: typography.fontSize.caption,
      lineHeight: typography.lineHeight.caption,
    },
    mediumText: {
      fontSize: typography.fontSize.body,
      lineHeight: typography.lineHeight.body,
    },
    largeText: {
      fontSize: typography.fontSize.subtitle,
      lineHeight: typography.lineHeight.subtitle,
    },
    // States
    disabled: {
      opacity: 0.5,
    },
    disabledText: {
      color: colors.current.textDisabled,
    },
    // Icons
    leftIcon: {
      marginRight: spacing.xs,
    },
    rightIcon: {
      marginLeft: spacing.xs,
    },
    loadingIndicator: {
      marginRight: spacing.s,
    },
  });
};

export default Button;