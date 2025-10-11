/**
 * MuhsinAI Asset Registry
 * 
 * This file centralizes all asset imports to avoid path issues and provide
 * better type checking for assets.
 */

// Logo assets - using static require statements for Metro bundler compatibility
export const LogoAssets = {
  // Use PNG versions for better compatibility
  logo: require('../../assets/images/png/logo.png'),
  nobg: require('../../assets/images/png/nobg.png'),
  inverse: require('../../assets/images/png/inverse.png'),
};

// Background images
export const BackgroundAssets = {
  appBg: require('../../assets/images/appbg.jpg'),
};

// Export all asset categories
export const Assets = {
  logos: LogoAssets,
  backgrounds: BackgroundAssets,
};

export default Assets;