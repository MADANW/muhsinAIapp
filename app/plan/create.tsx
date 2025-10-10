import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { callPlan } from '../lib/api';
import { useStore } from '../lib/store';
import { useTheme } from '../theme/ThemeProvider';

// Example plan prompts
const EXAMPLE_PROMPTS = [
  "Plan a productive day with focus on deep work",
  "Help me balance study and exercise today",
  "Create a schedule for a day with multiple meetings",
  "Plan a relaxed weekend day with prayer times",
  "Schedule a day with focus on job applications",
];

export default function CreatePlan() {
  const router = useRouter();
  const theme = useTheme();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get usage count from store
  const usageCount = useStore((state) => state.usageCount);
  const isPro = useStore((state) => state.isPro);
  
  // Function to generate a plan
  const handleCreatePlan = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for your plan');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the plan generation API
      const result = await callPlan({ prompt });
      
      if (result.plan) {
        // Navigate to view the created plan
        router.push({
          pathname: '/plan/view',
          params: { id: result.plan.id }
        });
      } else {
        throw new Error('No plan returned from API');
      }
    } catch (err: any) {
      console.error('Plan creation error:', err);
      
      // Handle usage limit errors
      if (err.message.includes('usage_limit_reached')) {
        // Navigate to paywall
        router.push('/paywall');
        return;
      }
      
      setError(err.message || 'Failed to create plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to use an example prompt
  const handleUseExample = (examplePrompt: string) => {
    setPrompt(examplePrompt);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="auto" />
      <ScrollView 
        style={[
          styles.container, 
          { backgroundColor: theme.colors.current.background }
        ]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text style={[
            styles.title, 
            { color: theme.colors.current.textPrimary }
          ]}>
            Create Your Plan
          </Text>
          
          {!isPro && (
            <Text style={[
              styles.usageCounter,
              { color: theme.colors.current.textSecondary }
            ]}>
              {3 - usageCount} free plans remaining
            </Text>
          )}
        </View>
        
        <View style={[
          styles.inputContainer,
          { backgroundColor: theme.colors.current.surface }
        ]}>
          <TextInput
            style={[
              styles.input,
              { color: theme.colors.current.textPrimary }
            ]}
            placeholder="Describe your day, goals, or schedule needs..."
            placeholderTextColor={theme.colors.current.textSecondary}
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>
        
        {error && (
          <Text style={[styles.errorText, { color: theme.colors.error.main }]}>
            {error}
          </Text>
        )}
        
        <TouchableOpacity
          style={[
            styles.createButton,
            { backgroundColor: theme.colors.primary.main },
            isLoading && styles.disabledButton
          ]}
          onPress={handleCreatePlan}
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.colors.primary.contrast} size="small" />
          ) : (
            <Text style={styles.createButtonText}>Generate Plan</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.examplesContainer}>
          <Text style={[
            styles.examplesTitle,
            { color: theme.colors.current.textSecondary }
          ]}>
            Try one of these:
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.examplesList}
          >
            {EXAMPLE_PROMPTS.map((examplePrompt, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.exampleChip,
                  { borderColor: theme.colors.primary.main }
                ]}
                onPress={() => handleUseExample(examplePrompt)}
              >
                <Text 
                  style={[
                    styles.exampleChipText,
                    { color: theme.colors.primary.main }
                  ]}
                  numberOfLines={1}
                >
                  {examplePrompt}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={[
            styles.infoText,
            { color: theme.colors.current.textSecondary }
          ]}>
            Plans include prayer times and scheduled activities based on your input.
            For best results, include specific goals, important tasks, and any time constraints.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  usageCounter: {
    fontSize: 14,
  },
  inputContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    fontSize: 16,
    minHeight: 120,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 20,
  },
  createButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  disabledButton: {
    opacity: 0.7,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  examplesContainer: {
    marginBottom: 24,
  },
  examplesTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  examplesList: {
    paddingRight: 16,
  },
  exampleChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  exampleChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoContainer: {
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  }
});