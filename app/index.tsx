import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { analytics, AnalyticsEvent } from './lib/analytics';
import { useAuth } from './lib/auth/provider';
import env, { validateEnv } from './lib/env';
import { useTheme } from './theme/ThemeProvider';

export default function Index() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    if (!isLoading) {
      // Track app opened event
      analytics.track(AnalyticsEvent.APP_OPENED, {
        is_authenticated: !!user
      });
      
      if (user) {
        router.replace('/home');
      } else {
        router.replace('/auth/signin');
      }
    }
  }, [user, isLoading, router]);

  // Debug view to check environment variables
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = env;
  const { valid, missing } = validateEnv();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.current.background }]}>
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      ) : (
        <View style={styles.debugContainer}>
          <Text style={[styles.title, { color: theme.colors.current.textPrimary }]}>MuhsinAI - Initialization</Text>
          <Text style={[styles.info, { color: theme.colors.current.textSecondary }]}>Environment Valid: {valid ? "✓" : "✗"}</Text>
          {!valid && (
            <Text style={[styles.info, { color: theme.colors.current.textSecondary }]}>Missing: {missing.join(', ')}</Text>
          )}
          <Text style={[styles.info, { color: theme.colors.current.textSecondary }]}>SUPABASE_URL: {SUPABASE_URL ? "Set ✓" : "Not set ✗"}</Text>
          <Text style={[styles.info, { color: theme.colors.current.textSecondary }]}>SUPABASE_ANON_KEY: {SUPABASE_ANON_KEY ? "Set ✓" : "Not set ✗"}</Text>
          <Text style={[styles.info, { color: theme.colors.current.textSecondary }]}>User: {user ? user.email : "Not signed in"}</Text>
          <Text style={[styles.button, { backgroundColor: theme.colors.primary.main, color: theme.colors.primary.contrast }]} onPress={() => router.replace('/auth/signin')}>
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
    padding: 12,
    borderRadius: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  }
});
