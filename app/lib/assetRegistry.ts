/**
 * MuhsinAI Asset Registry
 * 
 * This file centralizes all asset imports to avoid path issues and provide
 * better type checking for assets.
 */

// Logo assets
export const LogoAssets = {
  // Use PNG versions for better compatibility
  logo: require('../../assets/images/png/logo.png'),
  nobg: require('../../assets/images/png/nobg.png'),
  inverse: require('../../assets/images/png/inverse.png'),
  
  // Fallbacks to original ICO files (use only if needed)
  logoIco: require('../../assets/images/logo.ico'),
  nobgIco: require('../../assets/images/nobg.ico'),
  inverseIco: require('../../assets/images/inverse.ico'),
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