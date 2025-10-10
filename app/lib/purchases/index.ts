import { Platform } from 'react-native';
import Purchases, { CustomerInfo, PurchasesPackage } from 'react-native-purchases';
import env from '../env';
import { useStore } from '../store';

// Define the subscription tiers and their identifiers
export const SUBSCRIPTION_TYPES = {
  PRO_MONTHLY: 'pro_monthly',
  PRO_YEARLY: 'pro_yearly',
};

// Subscription entitlements
export const ENTITLEMENTS = {
  PRO: 'pro_access', // The entitlement ID configured in RevenueCat
};

/**
 * Initialize RevenueCat with your API keys
 */
export const initPurchases = async () => {
  try {
    // Set debug mode during development
    if (__DEV__) {
      Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    }

    // Initialize with the appropriate API key based on the platform
    const apiKey = Platform.select({
      ios: env.REVENUECAT_APPLE_API_KEY,
      android: env.REVENUECAT_GOOGLE_API_KEY,
    });

    if (!apiKey) {
      console.error('RevenueCat API key not found for platform', Platform.OS);
      return false;
    }

    await Purchases.configure({
      apiKey,
      appUserID: null, // We'll set this after authentication
    });

    return true;
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error);
    return false;
  }
};

/**
 * Set the user ID for RevenueCat to identify the current user
 * Call this after user authentication
 */
export const setUserId = async (userId: string) => {
  try {
    const { customerInfo } = await Purchases.logIn(userId);
    await syncPurchasesWithStore(customerInfo);
    return customerInfo;
  } catch (error) {
    console.error('Failed to set RevenueCat user ID:', error);
    throw error;
  }
};

/**
 * Reset the user ID when logging out
 */
export const resetUserId = async () => {
  try {
    await Purchases.logOut();
    // Reset the pro status in our local store
    await useStore.getState().setPro(false);
  } catch (error) {
    console.error('Failed to reset RevenueCat user ID:', error);
  }
};

/**
 * Fetch available packages (subscription options)
 */
export const getOfferings = async (): Promise<PurchasesPackage[]> => {
  try {
    const offerings = await Purchases.getOfferings();
    
    // Get the default offering
    const current = offerings.current;
    if (!current) {
      console.warn('No offerings found');
      return [];
    }
    
    return Object.values(current.availablePackages);
  } catch (error) {
    console.error('Failed to get offerings:', error);
    throw error;
  }
};

/**
 * Purchase a package
 */
export const purchasePackage = async (pkg: PurchasesPackage): Promise<CustomerInfo> => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    
    // Sync the purchase status with our local store
    await syncPurchasesWithStore(customerInfo);
    
    return customerInfo;
  } catch (error: any) {
    // Check if the user canceled the purchase
    if (!error.userCancelled) {
      console.error('Purchase error:', error);
    }
    throw error;
  }
};

/**
 * Restore purchases
 */
export const restorePurchases = async (): Promise<CustomerInfo> => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    
    // Sync the restored purchases with our local store
    await syncPurchasesWithStore(customerInfo);
    
    return customerInfo;
  } catch (error) {
    console.error('Failed to restore purchases:', error);
    throw error;
  }
};

/**
 * Get the current customer info (subscription status)
 */
export const getCustomerInfo = async (): Promise<CustomerInfo> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    
    // Sync with our local store
    await syncPurchasesWithStore(customerInfo);
    
    return customerInfo;
  } catch (error) {
    console.error('Failed to get customer info:', error);
    throw error;
  }
};

/**
 * Check if the user has pro access
 */
export const checkProAccess = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const entitlements = customerInfo.entitlements.active;
    return !!entitlements[ENTITLEMENTS.PRO];
  } catch (error) {
    console.error('Failed to check pro access:', error);
    return false;
  }
};

/**
 * Sync RevenueCat purchases with our local store
 */
async function syncPurchasesWithStore(customerInfo: CustomerInfo) {
  const entitlements = customerInfo.entitlements.active;
  const hasPro = !!entitlements[ENTITLEMENTS.PRO];
  
  // Update our store
  await useStore.getState().setPro(hasPro);
}

/**
 * Add a listener for changes to customerInfo
 */
export const setupPurchasesListener = (
  onUpdate: (customerInfo: CustomerInfo) => void
) => {
  return Purchases.addCustomerInfoUpdateListener(onUpdate);
};