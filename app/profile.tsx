import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import { useAuth } from './lib/auth/provider';
import { useStore } from './lib/store';

export default function Profile() {
  const { user, signOut, isLoading } = useAuth();
  const { isPro, usageCount } = useStore();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace('signin');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    router.replace('signin' as any);
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      <View style={styles.infoCard}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>
      
      <View style={styles.infoCard}>
        <Text style={styles.label}>Account Type:</Text>
        <Text style={styles.value}>{isPro ? 'Pro' : 'Free'}</Text>
      </View>
      
      {!isPro && (
        <View style={styles.infoCard}>
          <Text style={styles.label}>Plans Used:</Text>
          <Text style={styles.value}>{usageCount} / 3</Text>
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
  }
});
