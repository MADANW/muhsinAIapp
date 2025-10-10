import { Stack } from "expo-router";
import { useEffect } from 'react';
import { Linking, LogBox } from 'react-native';
import { supabase } from './lib/auth/client';
import { AuthProvider } from './lib/auth/provider';

// Ignore specific React Native warnings
LogBox.ignoreLogs([
  'The provided value \'ms-stream\' is not a valid \'responseType\'.',
  'AsyncStorage has been extracted from react-native core',
]);

export default function RootLayout() {
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
    <AuthProvider>
      <Stack>
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
            headerBackTitle: 'Back',
            presentation: 'modal',
          }} 
        />
      </Stack>
    </AuthProvider>
  );
}
