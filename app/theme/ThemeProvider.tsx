import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform, useColorScheme } from 'react-native';
import { borderRadius, colors, shadows, spacing, typography } from './constants';

/**
 * Theme context type definition
 */
interface ThemeContextType {
  isDarkMode: boolean;
  isWeb: boolean;
  toggleTheme: () => void;
  colors: typeof colors & {
    current: typeof colors.light | typeof colors.dark | typeof colors.unified;
  };
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
}

// Create the theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Theme provider component
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if we're running on web
  const isWeb = Platform.OS === 'web';
  
  // Get device color scheme
  const deviceColorScheme = useColorScheme();
  
  // State to track if the user has manually toggled the theme
  const [isManuallyToggled, setIsManuallyToggled] = useState(false);
  
  // State to track current dark mode setting
  // On web, we always use dark mode for the unified theme
  const [isDarkMode, setIsDarkMode] = useState(isWeb ? true : deviceColorScheme === 'dark');

  // Update theme based on device settings, unless manually set or on web
  useEffect(() => {
    if (!isManuallyToggled && !isWeb) {
      setIsDarkMode(deviceColorScheme === 'dark');
    }
  }, [deviceColorScheme, isManuallyToggled, isWeb]);

  // Function to toggle theme (disabled on web for unified experience)
  const toggleTheme = () => {
    if (isWeb) return; // Don't allow theme toggle on web
    setIsDarkMode(prev => !prev);
    setIsManuallyToggled(true);
  };

  // Determine which color scheme to use
  const getCurrentColors = () => {
    if (isWeb) {
      return colors.unified; // Always use unified dark theme on web
    }
    return isDarkMode ? colors.dark : colors.light;
  };

  // Prepare the theme context value
  const themeContextValue: ThemeContextType = {
    isDarkMode: isWeb ? true : isDarkMode, // Always dark on web
    isWeb,
    toggleTheme,
    colors: {
      ...colors,
      current: getCurrentColors(),
    },
    typography,
    spacing,
    borderRadius,
    shadows
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use the theme context
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

/**
 * Create a themed style
 * This function lets you create styles that automatically respond to theme changes
 */
export const createThemedStyles = <T extends Record<string, any>>(
  styleCreator: (theme: ThemeContextType) => T
): () => T => {
  return () => {
    const theme = useTheme();
    return styleCreator(theme);
  };
};