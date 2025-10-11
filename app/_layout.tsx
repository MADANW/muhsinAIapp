import { Stack } from "expo-router";
import { useEffect } from 'react';
import { Linking, LogBox } from 'react-native';
import { AnalyticsProvider } from './lib/analytics/analytics.provider';
import { supabase } from './lib/auth/client';
import { AuthProvider } from './lib/auth/provider';
import { initPurchases } from './lib/purchases/index';
import { ThemeProvider } from './theme/ThemeProvider';

// Ignore specific React Native warnings
LogBox.ignoreLogs([
  'The provided value \'ms-stream\' is not a valid \'responseType\'.',
  'AsyncStorage has been extracted from react-native core',
]);

export default function RootLayout() {
  // Initialize RevenueCat on app startup
  useEffect(() => {
    initPurchases().catch((error: any) => {
      console.error('Failed to initialize RevenueCat:', error);
    });
  }, []);
  
  useEffect(() => {
    // Handle deep links (magic link authentication)
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      if (url && url.includes('#access_token=')) {
        // Handle the magic link
        const [_, queryString] = url.split('#');
        const params = new URLSearchParams(queryString);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const type = params.get('type');
        
        if (accessToken && type === 'recovery' && refreshToken) {
          // Set the session manually
          supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
        }
      }
    };

    // Listen for deep links when the app is not open
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    // Listen for deep links when the app is already open
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <AnalyticsProvider debug={__DEV__}>
        <Stack screenOptions={{ headerShadowVisible: false }}>
        {/* Main screens */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen 
          name="profile" 
          options={{ 
            title: 'Profile',
            headerBackTitle: 'Back',
          }} 
        />
        <Stack.Screen 
          name="signin" 
          options={{ 
            title: 'Sign In',
            headerShown: false,
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="home" 
          options={{ 
            title: 'Home',
            headerBackTitle: 'Back',
          }} 
        />
        <Stack.Screen 
          name="plan" 
          options={{ 
            title: 'Prayer Plan',
            headerBackTitle: 'Back',
          }} 
        />
        <Stack.Screen 
          name="history" 
          options={{ 
            title: 'Plan History',
            headerBackTitle: 'Back',
          }} 
        />
        <Stack.Screen 
          name="paywall" 
          options={{ 
            title: 'Upgrade',
            headerShown: false,
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="test-purchases" 
          options={{ 
            title: 'Test RevenueCat',
            headerShown: true,
          }} 
        />
        <Stack.Screen 
          name="plan-detail" 
          options={{ 
            title: 'Plan Details',
            headerBackTitle: 'Back',
          }} 
        />
        
        {/* Auth flow */}
        <Stack.Screen
          name="auth/signin"
          options={{
            title: 'Sign In',
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="auth/magic-link-sent"
          options={{
            title: 'Magic Link Sent',
            headerShown: false,
          }}
        />
      </Stack>
      </AnalyticsProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}
