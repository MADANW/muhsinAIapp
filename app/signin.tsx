import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from './lib/auth/provider';
import { useTheme } from './theme/ThemeProvider';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { signIn } = useAuth();
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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.current.background }]}>
      <Text style={[styles.title, { color: theme.colors.current.textPrimary }]}>Welcome to MuhsinAI</Text>
      
      {!isSent ? (
        <>
          <Text style={[styles.subtitle, { color: theme.colors.current.textSecondary }]}>
            Enter your email to sign in or create an account
          </Text>
          
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.current.surface,
              borderColor: theme.colors.current.border,
              color: theme.colors.current.textPrimary
            }]}
            placeholder="you@example.com"
            placeholderTextColor={theme.colors.current.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading}
          />
          
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send Magic Link</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.sentContainer}>
          <Text style={[styles.sentTitle, { color: theme.colors.current.textPrimary }]}>Check your email</Text>
          <Text style={[styles.sentMessage, { color: theme.colors.current.textSecondary }]}>
            We've sent a magic link to {email}. Click the link in the email to sign in to MuhsinAI.
          </Text>
          <TouchableOpacity
            style={styles.resendButton}
            onPress={() => {
              setIsSent(false);
              setEmail('');
            }}
          >
            <Text style={[styles.resendButtonText, { color: '#007bff' }]}>Use a different email</Text>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
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
    textAlign: 'center',
    marginBottom: 30,
  },
  resendButton: {
    padding: 10,
  },
  resendButtonText: {
    fontSize: 16,
  },
});