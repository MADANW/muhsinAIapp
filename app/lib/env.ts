import Constants from 'expo-constants';

// Extract environment variables from Expo Constants
const extra = Constants.expoConfig?.extra || {};

// Define the environment variables interface
interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  REVENUECAT_APPLE_API_KEY: string;
  REVENUECAT_GOOGLE_API_KEY: string;
}

// Create the environment object
const env: Env = {
  SUPABASE_URL: extra.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: extra.SUPABASE_ANON_KEY || '',
  REVENUECAT_APPLE_API_KEY: extra.REVENUECAT_APPLE_API_KEY || '',
  REVENUECAT_GOOGLE_API_KEY: extra.REVENUECAT_GOOGLE_API_KEY || '',
};

// Validation function to check if required environment variables are set
export const validateEnv = (): { valid: boolean; missing: string[] } => {
  const missing = Object.entries(env)
    .filter(([_, value]) => !value)
    .map(([key]) => key);
  
  return {
    valid: missing.length === 0,
    missing,
  };
};

// Export the environment variables
export default env;