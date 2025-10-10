/**
 * MuhsinAI Theme Constants
 * 
 * This file contains all theme-related constants used throughout the app.
 * Colors, spacing, typography, and other design system elements are defined here.
 */

import { Platform } from 'react-native';
import { brandConfig, getDerivedColors } from './brand';

// Get derived colors based on brand config
const derivedColors = getDerivedColors();

// Function to adjust color brightness
function adjustBrightness(hex: string, percent: number): string {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse the hex string
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Adjust brightness
  const adjustValue = (value: number) => {
    return Math.max(0, Math.min(255, value + (value * percent / 100)));
  };
  
  // Convert back to hex
  const rHex = Math.round(adjustValue(r)).toString(16).padStart(2, '0');
  const gHex = Math.round(adjustValue(g)).toString(16).padStart(2, '0');
  const bHex = Math.round(adjustValue(b)).toString(16).padStart(2, '0');
  
  return `#${rHex}${gHex}${bHex}`;
}

// Color Palette
export const colors = {
  // Primary brand colors
  primary: {
    main: brandConfig.colors.primary,    // Main brand color
    light: derivedColors.primaryLight,    // Lighter version for hover states
    dark: derivedColors.primaryDark,      // Darker version for pressed states
    contrast: '#FFFFFF' // Text color on primary backgrounds
  },
  
  // Secondary colors
  secondary: {
    main: brandConfig.colors.secondary,    // Secondary brand color
    light: adjustBrightness(brandConfig.colors.secondary, 20),   // Lighter version
    dark: adjustBrightness(brandConfig.colors.secondary, -20),    // Darker version
    contrast: '#FFFFFF' // Text color on secondary backgrounds
  },
  
  // Accent color for highlighting
  accent: {
    main: brandConfig.colors.accent,    // Accent color
    light: adjustBrightness(brandConfig.colors.accent, 20),   // Lighter accent
    dark: adjustBrightness(brandConfig.colors.accent, -20),    // Darker accent
    contrast: '#FFFFFF' // Text on accent
  },
  
  // Semantic colors for feedback
  success: {
    main: brandConfig.colors.success,    // Success color
    light: adjustBrightness(brandConfig.colors.success, 20),   // Lighter success
    dark: adjustBrightness(brandConfig.colors.success, -20),    // Darker success
    contrast: '#FFFFFF' // Text on success
  },
  
  warning: {
    main: brandConfig.colors.warning,    // Warning color
    light: adjustBrightness(brandConfig.colors.warning, 20),   // Lighter warning
    dark: adjustBrightness(brandConfig.colors.warning, -20),    // Darker warning
    contrast: '#212529' // Text on warning (darker for accessibility)
  },
  
  error: {
    main: brandConfig.colors.danger,    // Error/danger color
    light: adjustBrightness(brandConfig.colors.danger, 20),   // Lighter error
    dark: adjustBrightness(brandConfig.colors.danger, -20),    // Darker error
    contrast: '#FFFFFF' // Text on error
  },
  
  // Light mode UI colors
  light: {
    background: brandConfig.colors.offWhite,   // Page background
    surface: brandConfig.colors.white,         // Card/elevated surface
    border: '#E0E0E0',                         // Light border color
    textPrimary: brandConfig.colors.textPrimary,     // Main text
    textSecondary: brandConfig.colors.textSecondary, // Secondary text
    textDisabled: '#A0A0A0',                   // Disabled text
    divider: '#EEEEEE'                         // Divider lines
  },
  
  // Dark mode UI colors
  dark: {
    background: '#121212',                    // Dark background
    surface: '#1E1E1E',                       // Card/elevated surface
    border: '#2C2C2C',                        // Border color
    textPrimary: brandConfig.colors.white,    // Main text
    textSecondary: '#BBBBBB',                 // Secondary text
    textDisabled: '#777777',                  // Disabled text
    divider: '#2C2C2C'                        // Divider lines
  }
};

// Typography
export const typography = {
  fontFamily: {
    // Use system fonts for native feel
    primary: Platform.select({
      ios: 'SF Pro Display',
      android: 'Roboto',
      default: 'System'
    }),
    body: Platform.select({
      ios: 'SF Pro Text',
      android: 'Roboto',
      default: 'System'
    })
  },
  
  // Font weights
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  },
  
  // Font sizes
  fontSize: {
    h1: 28,
    h2: 24,
    h3: 20,
    subtitle: 18,
    body: 16,
    caption: 14,
    small: 12
  },
  
  // Line heights
  lineHeight: {
    h1: 34,
    h2: 30,
    h3: 26,
    subtitle: 24,
    body: 22,
    caption: 20,
    small: 16
  }
};

// Spacing system
export const spacing = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48
};

// Border radius
export const borderRadius = {
  small: 4,
  medium: 8,
  large: 16,
  full: 9999  // For pills and circular elements
};

// Shadows
export const shadows = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4
  }
};

// Animation durations
export const animation = {
  short: 150,
  medium: 300,
  long: 500
};

// Layout constants
export const layout = {
  screenPadding: spacing.l,
  contentMaxWidth: 600,  // Max width for large screens
  tabBarHeight: 60
};

// Z-index stacking order
export const zIndex = {
  base: 0,
  card: 10,
  navigation: 50,
  modal: 100,
  toast: 1000
};