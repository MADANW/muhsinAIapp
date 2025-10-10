import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useStore } from './lib/store';

/**
 * Test component for simulating RevenueCat purchases during development
 */
export default function TestPurchases() {
  const { isPro, setPro } = useStore();

  const simulatePurchase = async (purchased: boolean) => {
    // Simulate a purchase by updating the local store
    await setPro(purchased);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <Text style={styles.title}>RevenueCat Test Environment</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Current Status:</Text>
        <Text style={[styles.statusValue, { color: isPro ? '#4CAF50' : '#F44336' }]}>
          {isPro ? 'PRO' : 'FREE'}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
        onPress={() => simulatePurchase(true)}
      >
        <Text style={styles.buttonText}>Simulate Successful Purchase</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#F44336', marginTop: 16 }]}
        onPress={() => simulatePurchase(false)}
      >
        <Text style={styles.buttonText}>Simulate Cancelled/Failed Purchase</Text>
      </TouchableOpacity>
      
      <Text style={styles.note}>
        Note: This is a test environment to simulate RevenueCat purchases.
        Once your app is registered with the App Store/Google Play and configured
        in RevenueCat, you'll be able to test real sandbox purchases.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  statusLabel: {
    fontSize: 18,
    marginRight: 10,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    marginTop: 40,
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
});