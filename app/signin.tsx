import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from './lib/auth/provider';
import { useTheme } from './theme/ThemeProvider';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);
  const [isSent, setIsSent] = useState(false);
  const { signIn, signInWithGoogle, signInWithApple } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const handleSignIn = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    
    try {
      const { success, error } = await signIn(email);
      
      if (success) {
        setIsSent(true);
      } else {
        Alert.alert('Sign-in failed', error?.message || 'Something went wrong');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to send magic link. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to handle sign in with Google
  const handleGoogleSignIn = async () => {
    setSocialLoading('google');
    
    try {
      const { success, error } = await signInWithGoogle();
      
      if (!success) {
        Alert.alert('Sign-in failed', error?.message || 'Failed to sign in with Google');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to sign in with Google. Please try again later.');
      console.error(err);
    } finally {
      setSocialLoading(null);
    }
  };
  
  // Function to handle sign in with Apple
  const handleAppleSignIn = async () => {
    setSocialLoading('apple');
    
    try {
      const { success, error } = await signInWithApple();
      
      if (!success) {
        Alert.alert('Sign-in failed', error?.message || 'Failed to sign in with Apple');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to sign in with Apple. Please try again later.');
      console.error(err);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to MuhsinAI</Text>
      
      {!isSent ? (
        <>
          <Text style={styles.subtitle}>
            Enter your email to sign in or create an account
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading && socialLoading === null}
          />
          
          <TouchableOpacity
            style={[styles.button, (isLoading || socialLoading !== null) && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={isLoading || socialLoading !== null}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send Magic Link</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleGoogleSignIn}
              disabled={isLoading || socialLoading !== null}
            >
              {socialLoading === 'google' ? (
                <ActivityIndicator size="small" color={theme.colors.current.textPrimary} />
              ) : (
                <>
                  <FontAwesome name="google" size={18} color={theme.colors.current.textPrimary} style={styles.socialIcon} />
                  <Text style={styles.socialButtonText}>Google</Text>
                </>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleAppleSignIn}
              disabled={isLoading || socialLoading !== null}
            >
              {socialLoading === 'apple' ? (
                <ActivityIndicator size="small" color={theme.colors.current.textPrimary} />
              ) : (
                <>
                  <FontAwesome name="apple" size={22} color={theme.colors.current.textPrimary} style={styles.socialIcon} />
                  <Text style={styles.socialButtonText}>Apple</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.sentContainer}>
          <Text style={styles.sentTitle}>Check your email</Text>
          <Text style={styles.sentMessage}>
            We've sent a magic link to {email}. Click the link in the email to sign in to MuhsinAI.
          </Text>
          <TouchableOpacity
            style={styles.resendButton}
            onPress={() => {
              setIsSent(false);
              setEmail('');
            }}
          >
            <Text style={styles.resendButtonText}>Use a different email</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#99c2ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#666',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  socialButtonText: {
    fontSize: 16,
    color: '#333',
  },
  socialIcon: {
    marginRight: 10,
  },
  sentContainer: {
    alignItems: 'center',
    padding: 20,
  },
  sentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sentMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  resendButton: {
    padding: 10,
  },
  resendButtonText: {
    color: '#007bff',
    fontSize: 16,
  },
});