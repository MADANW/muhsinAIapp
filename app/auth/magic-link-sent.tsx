import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Images } from '../theme/ImageRegistry';
import { useTheme } from '../theme/ThemeProvider';

/**
 * MagicLinkSentScreen component
 * 
 * A clean, confirmation screen after sending a magic link
 */
export default function MagicLinkSentScreen() {
  const router = useRouter();
  const theme = useTheme();
  
  // Function to handle navigating back to sign in
  const handleBackToSignIn = () => {
    router.back();
  };

  return (
    <ImageBackground 
      source={Images.backgrounds.auth} 
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <StatusBar style="light" />
      
      <View style={styles.overlay}>
        <View style={styles.logoContainer}>
          <Image source={Images.logo.inverse} style={styles.logo} />
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: theme.colors.current.textPrimary }]}>
            Check your email
          </Text>
          
          <Text style={[styles.subtitle, { color: theme.colors.current.textSecondary }]}>
            We sent you a magic link to sign in to your account. Please check your email inbox.
          </Text>
          
          <View style={styles.emailIllustrationContainer}>
            {/* Here you would ideally show a Lottie animation for email sent */}
            <Image source={Images.logo.main} style={styles.emailIllustration} />
          </View>
          
          <Text style={[styles.instructionText, { color: theme.colors.current.textSecondary }]}>
            The link in the email will expire in 24 hours. If you don't see the email, check your spam folder.
          </Text>
          
          <TouchableOpacity
            style={[styles.resendButton, { borderColor: theme.colors.primary.main }]}
            onPress={handleBackToSignIn}
          >
            <Text style={[styles.resendButtonText, { color: theme.colors.primary.main }]}>
              Back to Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  contentContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  emailIllustrationContainer: {
    marginVertical: 32,
  },
  emailIllustration: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  resendButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 32,
    borderWidth: 1,
  },
  resendButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});