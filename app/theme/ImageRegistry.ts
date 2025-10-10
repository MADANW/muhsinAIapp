/**
 * ImageRegistry.ts
 * 
 * This file centralizes all image imports and provides a clean API for accessing images.
 * Register all images here so they can be easily referenced throughout the app.
 */

type ImageSource = number; // For require('./path/to/image.png')

interface ImageRegistry {
  // App branding
  logo: {
    main: ImageSource;
    small: ImageSource;
    inverse: ImageSource;
    noBg: ImageSource;
  };
  
  // Illustrations for various screens
  illustrations: {
    onboarding: ImageSource;
    emptyState: ImageSource;
    emailSent: ImageSource;
    noPlans: ImageSource;
    paywall: ImageSource;
  };
  
  // UI elements
  icons: {
    prayer: ImageSource;
    plan: ImageSource;
    profile: ImageSource;
    plus: ImageSource;
    check: ImageSource;
  };
  
  // Background images
  backgrounds: {
    pattern: ImageSource;
    auth: ImageSource;
  };
}

// Use a placeholder for images that aren't available yet
const placeholderImage = require('../../assets/images/logo.png');

/**
 * Register all images here
 * 
 * To add a new image:
 * 1. Place the image in the assets/images directory
 * 2. Add it to the Images object below
 * 3. Update the ImageRegistry interface above if needed
 */
export const Images: ImageRegistry = {
  logo: {
    main: require('../../assets/images/logo.png'),
    small: require('../../assets/images/logo.png'),
    inverse: require('../../assets/images/inverse.png'),
    noBg: require('../../assets/images/nobg.png'),
  },
  
  illustrations: {
    onboarding: placeholderImage, // Replace with actual onboarding illustration
    emptyState: placeholderImage, // Replace with actual empty state illustration
    emailSent: placeholderImage,  // Replace with email sent illustration
    noPlans: placeholderImage,    // Replace with no plans illustration
    paywall: placeholderImage,    // Replace with paywall illustration
  },
  
  icons: {
    prayer: placeholderImage,     // Replace with prayer icon
    plan: placeholderImage,       // Replace with plan icon
    profile: placeholderImage,    // Replace with profile icon
    plus: placeholderImage,       // Replace with plus icon
    check: placeholderImage,      // Replace with check icon
  },
  
  backgrounds: {
    pattern: placeholderImage,    // Replace with pattern background if needed
    auth: require('../../assets/images/appbg.jpg'),  // Auth background image
  },
};

/**
 * How to use:
 * 
 * import { Images } from '../path/to/ImageRegistry';
 * 
 * // In your component:
 * <Image source={Images.logo.main} style={styles.logo} />
 */