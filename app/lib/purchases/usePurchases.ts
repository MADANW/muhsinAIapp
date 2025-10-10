import { useCallback, useEffect, useState } from 'react';
import { CustomerInfo, PurchasesPackage } from 'react-native-purchases';
import { useAuth } from '../auth/provider';
import * as Purchases from '../purchases';

/**
 * Hook for interacting with RevenueCat purchases
 */
export const usePurchases = () => {
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [offerings, setOfferings] = useState<PurchasesPackage[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isPro, setIsPro] = useState(false);

  // Initialize RevenueCat when the hook is first used
  useEffect(() => {
    const initializeRevenueCat = async () => {
      try {
        const success = await Purchases.initPurchases();
        setIsInitialized(success);
        
        // If user is authenticated, set the RevenueCat user ID
        if (success && user) {
          await Purchases.setUserId(user.id);
        }
        
        // Get customer info and offerings
        await refreshPurchaserInfo();
        await fetchOfferings();
      } catch (error) {
        console.error('Failed to initialize RevenueCat:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeRevenueCat();
    
    // Add listener for customer info updates
    Purchases.setupPurchasesListener((info) => {
      setCustomerInfo(info);
      const proEntitlement = info?.entitlements.active[Purchases.ENTITLEMENTS.PRO];
      setIsPro(!!proEntitlement);
    });
    
    // No cleanup needed as the listener will be automatically removed when the component unmounts
  }, [user]);

  // Refresh user info from RevenueCat
  const refreshPurchaserInfo = useCallback(async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
      
      // Check for pro entitlement
      const proEntitlement = info?.entitlements.active[Purchases.ENTITLEMENTS.PRO];
      setIsPro(!!proEntitlement);
      
      return info;
    } catch (error) {
      console.error('Failed to refresh purchaser info:', error);
      return null;
    }
  }, []);

  // Fetch available offerings
  const fetchOfferings = useCallback(async () => {
    try {
      const pkgs = await Purchases.getOfferings();
      setOfferings(pkgs);
      return pkgs;
    } catch (error) {
      console.error('Failed to fetch offerings:', error);
      return [];
    }
  }, []);

  // Purchase a package
  const purchasePackage = useCallback(async (pkg: PurchasesPackage) => {
    try {
      const info = await Purchases.purchasePackage(pkg);
      setCustomerInfo(info);
      
      // Check for pro entitlement
      const proEntitlement = info?.entitlements.active[Purchases.ENTITLEMENTS.PRO];
      setIsPro(!!proEntitlement);
      
      return { success: true, customerInfo: info };
    } catch (error: any) {
      return { 
        success: false, 
        error, 
        userCancelled: error.userCancelled 
      };
    }
  }, []);

  // Restore purchases
  const restorePurchases = useCallback(async () => {
    try {
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
      
      // Check for pro entitlement
      const proEntitlement = info?.entitlements.active[Purchases.ENTITLEMENTS.PRO];
      setIsPro(!!proEntitlement);
      
      return { success: true, customerInfo: info };
    } catch (error) {
      return { success: false, error };
    }
  }, []);

  return {
    isInitialized,
    isLoading,
    offerings,
    customerInfo,
    isPro,
    refreshPurchaserInfo,
    fetchOfferings,
    purchasePackage,
    restorePurchases,
  };
};