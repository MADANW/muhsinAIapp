import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { analytics, AnalyticsEvent } from './lib/analytics';
import { useAuth } from './lib/auth/provider';
import env, { validateEnv } from './lib/env';

export default function Index() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Track app opened event
      analytics.track(AnalyticsEvent.APP_OPENED, {
        is_authenticated: !!user
      });
      
      if (user) {
        router.replace('/home' as any);
      } else {
        router.replace('/auth/signin' as any);
      }
    }
  }, [user, isLoading, router]);

  // Debug view to check environment variables
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = env;
  const { valid, missing } = validateEnv();

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <View style={styles.debugContainer}>
          <Text style={styles.title}>MuhsinAI - Initialization</Text>
          <Text style={styles.info}>Environment Valid: {valid ? "✓" : "✗"}</Text>
          {!valid && (
            <Text style={styles.info}>Missing: {missing.join(', ')}</Text>
          )}
          <Text style={styles.info}>SUPABASE_URL: {SUPABASE_URL ? "Set ✓" : "Not set ✗"}</Text>
          <Text style={styles.info}>SUPABASE_ANON_KEY: {SUPABASE_ANON_KEY ? "Set ✓" : "Not set ✗"}</Text>
          <Text style={styles.info}>User: {user ? user.email : "Not signed in"}</Text>
          <Text style={styles.button} onPress={() => router.replace('/auth/signin' as any)}>
            Go to Sign In
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  debugContainer: {
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    color: 'white',
    padding: 12,
    borderRadius: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  }
});
