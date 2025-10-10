/**
 * MuhsinAI Brand Configuration
 *
 * This file contains all brand-specific settings that can be customized.
 * Update these values to match your brand guidelines.
 */

export const brandConfig = {
  // Brand Colors - MuhsinAI specific colors
  colors: {
    // Primary brand color (used for buttons, links, etc.)
    primary: '#2E4A35', // MuhsinAI dark green
    
    // Secondary brand color
    secondary: '#3D6145', // MuhsinAI medium green
    
    // Accent color for highlights and interactive elements
    accent: '#4A7456', // MuhsinAI lighter green
    
    // Darker shade for pressed states and accents
    dark: '#203425', // MuhsinAI darker green
    
    // UI colors
    white: '#FFFFFF',  // Pure white
    offWhite: '#F7F8F7', // Slight off-white for backgrounds
    
    // Text colors
    textPrimary: '#1E1E1E', // Near black for primary text
    textSecondary: '#6B6B6B', // Gray for secondary text
    
    // UI Feedback colors - using semantic colors that complement the brand
    success: '#3D6145', // Using secondary green for success
    warning: '#E9B949', // Gold/yellow for warnings
    danger: '#D64045', // Red for errors/destructive actions
  },
  
  // Typography settings
  typography: {
    // If you want to use custom fonts, configure them here
    // Note: You'll need to load these fonts with expo-font
    fontFamily: {
      // Examples (update with your brand fonts if applicable)
      heading: undefined, // undefined uses system fonts
      body: undefined,    // undefined uses system fonts
      
      // Example of custom font configuration:
      // heading: 'Poppins-Bold',
      // body: 'Poppins-Regular',
    }
  },
  
  // Brand Assets - Update these paths to match your actual assets
  assets: {
    // Logo variations
    logo: {
      primary: require('../../assets/images/logo.ico'),
      noBg: require('../../assets/images/nobg.ico'),
      inverse: require('../../assets/images/inverse.ico'),
      // Add variations if needed:
      // horizontal: require('../../assets/images/logo-horizontal.png'),
      // monochrome: require('../../assets/images/logo-mono.png'),
    },
    
    // Animations
    animations: {
      // Example (uncomment and update paths when you add animations):
      // loading: require('../../assets/animations/loading.json'),
      // success: require('../../assets/animations/success.json'),
      // emailSent: require('../../assets/animations/email-sent.json'),
    },
    
    // Illustrations for various screens
    illustrations: {
      // Example (uncomment and update paths when you add illustrations):
      // onboarding: require('../../assets/images/onboarding-illustration.png'),
      // emptyState: require('../../assets/images/empty-state.png'),
    },
  },
  
  // Brand-specific measurements
  dimensions: {
    // Adjust these based on your design needs
    borderRadius: {
      button: 8,
      card: 12,
      input: 8,
    },
  },
  
  // Animation preferences
  animation: {
    // Duration in milliseconds
    defaultDuration: 300,
    // Easing functions can be specified when we implement animations
  }
};

/**
 * Helper function to get derived colors (lighter/darker versions)
 * You can use this to generate variations of your brand colors
 */
export const getDerivedColors = () => {
  const { colors } = brandConfig;
  
  return {
    primaryLight: adjustBrightness(colors.primary, 20),
    primaryDark: adjustBrightness(colors.primary, -20),
    // Add more derived colors as needed
  };
};

/**
 * Helper function to adjust brightness of a hex color
 * @param hex The hex color to adjust
 * @param percent Percentage to adjust (-100 to 100)
 */
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