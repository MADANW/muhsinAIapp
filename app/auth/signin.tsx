import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../lib/auth/provider';
import { authLogger } from '../lib/logger';
import { Images } from '../theme/ImageRegistry';
import { useTheme } from '../theme/ThemeProvider';

/**
 * SignInScreen component
 * 
 * A clean, focused sign-in screen inspired by ChatGPT's minimalist design
 */
export default function SignInScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Function to handle sign in with magic link
  const handleSignIn = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the authentication provider's signIn method
      const { success, error } = await signIn(email);
      
      if (success) {
        // Navigate to the magic link sent screen
        router.push('/auth/magic-link-sent');
      } else {
        setError(error?.message || 'Failed to send magic link. Please try again.');
        authLogger.error('Sign in error:', error);
      }
    } catch (error) {
      setError('Failed to send magic link. Please try again.');
      authLogger.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={Images.backgrounds.auth} 
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <StatusBar style="light" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.overlay}>
          <View style={styles.logoContainer}>
            <Image source={Images.logo.inverse} style={styles.logo} />
          </View>
          
          <View style={[styles.formContainer, { backgroundColor: theme.colors.current.background }]}>
            <Text style={[styles.title, { color: theme.colors.current.textPrimary }]}>
              Welcome to MuhsinAI
            </Text>
            
            <Text style={[styles.subtitle, { color: theme.colors.current.textSecondary }]}>
              Sign in or create an account to get started
            </Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  { 
                    borderColor: error ? theme.colors.error.main : theme.colors.current.border,
                    color: theme.colors.current.textPrimary,
                    backgroundColor: theme.colors.current.surface
                  }
                ]}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.current.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
              />
              
              {error && (
                <Text style={[styles.errorText, { color: theme.colors.error.main }]}>
                  {error}
                </Text>
              )}
            </View>
            
            <TouchableOpacity
              style={[
                styles.signInButton,
                { backgroundColor: theme.colors.primary.main },
                isLoading && styles.disabledButton
              ]}
              onPress={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.colors.primary.contrast} size="small" />
              ) : (
                <Text style={styles.signInButtonText}>Send Magic Link</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.current.textSecondary }]}>
              By signing in, you agree to our
            </Text>
            <TouchableOpacity>
              <Text style={[styles.footerLink, { color: theme.colors.primary.main }]}>
                Terms & Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.85,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: 24,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  formContainer: {
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 20,
    alignSelf: 'stretch',
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
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 8,
  },
  signInButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    marginBottom: 5,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});