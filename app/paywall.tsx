import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { PurchasesPackage } from 'react-native-purchases';
import { usePurchases } from './lib/purchases/usePurchases';
import { useTheme } from './theme/ThemeProvider';

// Feature list for Pro subscription
const PRO_FEATURES = [
  { icon: 'check', title: 'Unlimited Prayer Plans', description: 'Generate as many plans as you need' },
  { icon: 'star', title: 'Advanced Customization', description: 'Tailor plans to your specific needs' },
  { icon: 'cloud', title: 'Cloud Synchronization', description: 'Access your plans on all your devices' },
  { icon: 'bell', title: 'Prayer Reminders', description: 'Get notified about your prayer times' },
];

export default function Paywall() {
  const router = useRouter();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { offerings, isPro, isLoading, purchasePackage, restorePurchases } = usePurchases();
  
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  
  // Find monthly and yearly packages
  const monthlyPackage = offerings.find(pkg => pkg.identifier === 'pro_monthly');
  const yearlyPackage = offerings.find(pkg => pkg.identifier === 'pro_yearly');
  
  // Calculate yearly discount percentage if both packages are available
  let discountPercent = 0;
  if (monthlyPackage && yearlyPackage) {
    const monthlyAnnualCost = monthlyPackage.product.price * 12;
    const yearlyCost = yearlyPackage.product.price;
    discountPercent = Math.round(((monthlyAnnualCost - yearlyCost) / monthlyAnnualCost) * 100);
  }
  
  // Handle subscription purchase
  const handleSubscribe = useCallback(async () => {
    if (!selectedPackage) {
      Alert.alert('Select a Plan', 'Please select a subscription plan to continue.');
      return;
    }
    
    setPurchasing(true);
    
    try {
      const { success, error, userCancelled } = await purchasePackage(selectedPackage);
      
      if (success) {
        Alert.alert('Thank You!', 'Your subscription was successful!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else if (!userCancelled) {
        Alert.alert('Purchase Failed', error?.message || 'There was an issue processing your payment.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
    } finally {
      setPurchasing(false);
    }
  }, [selectedPackage, purchasePackage, router]);
  
  // Handle restore purchases
  const handleRestore = useCallback(async () => {
    setRestoring(true);
    
    try {
      const { success, error } = await restorePurchases();
      
      if (success && isPro) {
        Alert.alert('Subscription Restored', 'Your Pro subscription has been restored!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('No Subscription Found', 'We couldn\'t find an active subscription linked to your account.');
      }
    } catch (error) {
      console.error('Restore error:', error);
    } finally {
      setRestoring(false);
    }
  }, [restorePurchases, isPro, router]);
  
  // Handle close button press
  const handleClose = () => {
    router.back();
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Close button */}
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <FontAwesome name="times" size={20} color="#fff" />
      </TouchableOpacity>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            contentFit="contain"
          />
          <Text style={[styles.title, { color: theme.colors.current.textPrimary }]}>
            Upgrade to MuhsinAI Pro
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.current.textSecondary }]}>
            Unlock the full power of MuhsinAI
          </Text>
        </View>
        
        {/* Features list */}
        <View style={styles.featuresContainer}>
          {PRO_FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: theme.colors.primary.main }]}>
                <FontAwesome name={feature.icon as any} size={16} color="#fff" />
              </View>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: theme.colors.current.textPrimary }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: theme.colors.current.textSecondary }]}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
        
        {/* Subscription options */}
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary.main} style={styles.loader} />
        ) : (
          <View style={styles.plansContainer}>
            {/* Monthly subscription */}
            {monthlyPackage && (
              <TouchableOpacity
                style={[
                  styles.planCard,
                  selectedPackage?.identifier === monthlyPackage.identifier && 
                  { borderColor: theme.colors.primary.main, borderWidth: 2 }
                ]}
                onPress={() => setSelectedPackage(monthlyPackage)}
              >
                <Text style={[styles.planTitle, { color: theme.colors.current.textPrimary }]}>
                  Monthly
                </Text>
                <Text style={[styles.planPrice, { color: theme.colors.current.textPrimary }]}>
                  {monthlyPackage.product.priceString}
                </Text>
                <Text style={[styles.planBilling, { color: theme.colors.current.textSecondary }]}>
                  per month
                </Text>
                {selectedPackage?.identifier === monthlyPackage.identifier && (
                  <View style={[styles.selectedCheck, { backgroundColor: theme.colors.primary.main }]}>
                    <FontAwesome name="check" size={12} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            )}
            
            {/* Yearly subscription */}
            {yearlyPackage && (
              <TouchableOpacity
                style={[
                  styles.planCard,
                  { marginTop: 15 },
                  selectedPackage?.identifier === yearlyPackage.identifier && 
                  { borderColor: theme.colors.primary.main, borderWidth: 2 }
                ]}
                onPress={() => setSelectedPackage(yearlyPackage)}
              >
                {discountPercent > 0 && (
                  <View style={[styles.saveBadge, { backgroundColor: theme.colors.primary.main }]}>
                    <Text style={styles.saveBadgeText}>Save {discountPercent}%</Text>
                  </View>
                )}
                
                <Text style={[styles.planTitle, { color: theme.colors.current.textPrimary }]}>
                  Yearly
                </Text>
                <Text style={[styles.planPrice, { color: theme.colors.current.textPrimary }]}>
                  {yearlyPackage.product.priceString}
                </Text>
                <Text style={[styles.planBilling, { color: theme.colors.current.textSecondary }]}>
                  per year
                </Text>
                {selectedPackage?.identifier === yearlyPackage.identifier && (
                  <View style={[styles.selectedCheck, { backgroundColor: theme.colors.primary.main }]}>
                    <FontAwesome name="check" size={12} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}
        
        {/* Subscribe button */}
        <TouchableOpacity
          style={[
            styles.subscribeButton,
            { backgroundColor: theme.colors.primary.main },
            (purchasing || !selectedPackage) && { opacity: 0.7 }
          ]}
          onPress={handleSubscribe}
          disabled={purchasing || !selectedPackage}
        >
          {purchasing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.subscribeButtonText}>
              {selectedPackage ? `Subscribe ${selectedPackage.product.priceString}` : 'Select a Plan'}
            </Text>
          )}
        </TouchableOpacity>
        
        {/* Restore purchases */}
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={restoring}
        >
          {restoring ? (
            <ActivityIndicator color={theme.colors.primary.main} size="small" />
          ) : (
            <Text style={[styles.restoreButtonText, { color: theme.colors.primary.main }]}>
              Restore Purchases
            </Text>
          )}
        </TouchableOpacity>
        
        {/* Terms and policy */}
        <Text style={[styles.termsText, { color: theme.colors.current.textSecondary }]}>
          Payment will be charged to your {Platform.OS === 'ios' ? 'Apple ID' : 'Google Play'} account at confirmation of purchase. 
          Subscription automatically renews unless it is canceled at least 24 hours before the end of the current period. 
          Your account will be charged for renewal within 24 hours prior to the end of the current period.
        </Text>
        
        <View style={styles.linksContainer}>
          <TouchableOpacity>
            <Text style={[styles.link, { color: theme.colors.primary.main }]}>
              Terms of Service
            </Text>
          </TouchableOpacity>
          <Text style={{ color: theme.colors.current.textSecondary }}>•</Text>
          <TouchableOpacity>
            <Text style={[styles.link, { color: theme.colors.primary.main }]}>
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
  },
  loader: {
    marginVertical: 20,
  },
  plansContainer: {
    marginBottom: 30,
  },
  planCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    position: 'relative',
  },
  selectedCheck: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBadge: {
    position: 'absolute',
    top: -12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  saveBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planBilling: {
    fontSize: 14,
  },
  subscribeButton: {
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  restoreButton: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  restoreButtonText: {
    fontSize: 16,
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 8,
  },
});
