import { useRouter } from "expo-router";
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "./lib/auth/provider";
import { useStore } from "./lib/store";
import { useTheme } from "./theme/ThemeProvider";

export default function Home() {
  const router = useRouter();
  const { user, session, isLoading, signOut } = useAuth();
  const { usageCount, isPro, incUsage } = useStore();
  const theme = useTheme();

  useEffect(() => {
    // If no session and not loading, redirect to sign in
    if (!session && !isLoading) {
      router.replace('/auth/signin');
    }
  }, [session, isLoading, router]);

  const handleGenerate = async () => {
    // client-side gate: free users get 3 total generations
    if (!isPro && usageCount >= 3) {
      router.push("/paywall");
      return;
    }

    await incUsage();
    router.push("/plan");
  };
  
  // If loading, show loading screen
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  // If no user, don't render anything (we'll redirect in the effect)
  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to MuhsinAI</Text>
      <Text style={styles.email}>{user.email}</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{usageCount}</Text>
          <Text style={styles.statLabel}>Plans Generated</Text>
        </View>
        
        <View style={styles.stat}>
          <Text style={styles.statValue}>{isPro ? 'PRO' : 'FREE'}</Text>
          <Text style={styles.statLabel}>Account Type</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Prayer Plans</Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.colors.primary.main }]} 
          onPress={handleGenerate}
        >
          <Text style={styles.buttonText}>Generate New Plan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.colors.secondary.main }]} 
          onPress={() => router.push('/history')}
        >
          <Text style={styles.buttonText}>View Plan History</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.colors.current.border }]} 
        onPress={() => router.push('/profile')}
      >
        <Text style={styles.buttonText}>View Profile</Text>
      </TouchableOpacity>
      
      {!isPro && (
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#8E44AD' }]} 
          onPress={() => router.push('/paywall')}
        >
          <Text style={styles.buttonText}>Upgrade to Pro</Text>
        </TouchableOpacity>
      )}
      
      {/* Test Environment Button for development */}
      {__DEV__ && (
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#FF9800', marginTop: 10 }]} 
          onPress={() => router.push('/test-purchases')}
        >
          <Text style={styles.buttonText}>Test RevenueCat (Dev Only)</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity 
        style={styles.signOutButton} 
        onPress={signOut}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 10,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    paddingVertical: 20,
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    width: '100%',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: {
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  signOutText: {
    color: '#ff3b30',
    fontSize: 16,
  },
});
