import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { borderRadius, colors, shadows, spacing, typography } from './constants';

/**
 * Theme context type definition
 */
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: typeof colors & {
    current: typeof colors.light | typeof colors.dark;
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
  // Get device color scheme
  const deviceColorScheme = useColorScheme();
  
  // State to track if the user has manually toggled the theme
  const [isManuallyToggled, setIsManuallyToggled] = useState(false);
  
  // State to track current dark mode setting
  const [isDarkMode, setIsDarkMode] = useState(deviceColorScheme === 'dark');

  // Update theme based on device settings, unless manually set
  useEffect(() => {
    if (!isManuallyToggled) {
      setIsDarkMode(deviceColorScheme === 'dark');
    }
  }, [deviceColorScheme, isManuallyToggled]);

  // Function to toggle theme
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    setIsManuallyToggled(true);
  };

  // Prepare the theme context value
  const themeContextValue: ThemeContextType = {
    isDarkMode,
    toggleTheme,
    colors: {
      ...colors,
      current: isDarkMode ? colors.dark : colors.light,
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