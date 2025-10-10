import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { usePlanAnalytics } from './lib/analytics/analytics.hooks';
import { callPlan } from './lib/api';
import { useAuth } from './lib/auth/provider';
import { useStore } from './lib/store';
import { useTheme } from './theme/ThemeProvider';

// Type definitions for plan data
interface TimeBlock {
  time: string;
  title: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
}

interface PlanData {
  generated_at: string;
  meta: {
    source: string;
    version: number;
  };
  day: string;
  blocks: TimeBlock[];
}

export default function Plan() {
  const router = useRouter();
  const theme = useTheme();
  const { user, session } = useAuth();
  const { isPro, usageCount } = useStore();
  const planAnalytics = usePlanAnalytics();
  
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<PlanData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated
  useEffect(() => {
    if (!user || !session) {
      router.replace('/auth/signin' as any);
    }
  }, [user, session, router]);

  // Handle plan generation
  const handleGeneratePlan = async () => {
    if (!prompt.trim()) {
      setError('Please enter a plan request.');
      return;
    }

    // Clear previous state
    setError(null);
    setIsGenerating(true);
    setGeneratedPlan(null);

    try {
      // Track plan request
      planAnalytics.trackPlanRequested(prompt.trim(), {
        length: prompt.length,
        is_pro: isPro
      });
      
      // Call the API to generate a plan
      const result = await callPlan({ prompt: prompt.trim() });
      
      // Extract plan data from the response
      const planData = result.plan?.content_json as PlanData;
      if (!planData) {
        throw new Error('Invalid response from server');
      }
      
      setGeneratedPlan(planData);
      
      // Track successful plan generation
      planAnalytics.trackPlanGenerated(result.plan?.id || 'unknown', {
        prompt_length: prompt.length,
        block_count: planData.blocks.length
      });
    } catch (err: any) {
      console.error('Plan generation error:', err);
      
      // Handle usage limit error
      if (err.message === 'usage_limit_reached') {
        Alert.alert(
          'Usage Limit Reached',
          'You\'ve reached the free plan limit. Upgrade to Pro for unlimited plans.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Upgrade', onPress: () => router.push('/paywall' as any) }
          ]
        );
      } else {
        setError('Failed to generate plan. Please try again.');
      }
      
      // Track error event
      planAnalytics.trackPlanError(err.message || 'unknown_error', {
        prompt_length: prompt.length
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Render priority badge based on priority level
  const renderPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    
    const badgeColors = {
      high: '#e53935', // Red
      medium: '#fb8c00', // Orange
      low: '#43a047', // Green
    };
    
    const color = priority === 'high' ? badgeColors.high : 
                 priority === 'medium' ? badgeColors.medium : 
                 badgeColors.low;
    
    return (
      <View style={[styles.priorityBadge, { backgroundColor: color }]}>
        <Text style={styles.priorityText}>{priority}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.current.textPrimary }]}>
          Create Daily Plan
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.current.textSecondary }]}>
          {isPro ? 'Pro Access: Unlimited Plans' : `Free Plan: ${usageCount}/3 Plans Used`}
        </Text>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.colors.current.border, color: theme.colors.current.textPrimary }
          ]}
          placeholder="Describe your day, tasks, or schedule needs..."
          placeholderTextColor={theme.colors.current.textSecondary}
          multiline
          value={prompt}
          onChangeText={setPrompt}
          editable={!isGenerating}
        />
        
        {error && (
          <Text style={[styles.errorText, { color: theme.colors.error.main }]}>
            {error}
          </Text>
        )}
        
        <TouchableOpacity
          style={[
            styles.generateButton,
            { backgroundColor: theme.colors.primary.main },
            (isGenerating || !prompt.trim()) && styles.disabledButton
          ]}
          onPress={handleGeneratePlan}
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.generateButtonText}>Generate Plan</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {isGenerating ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={[styles.loadingText, { color: theme.colors.current.textSecondary }]}>
            Creating your plan...
          </Text>
        </View>
      ) : generatedPlan ? (
        <ScrollView 
          style={styles.planContainer}
          contentContainerStyle={styles.planContent}
        >
          <View style={styles.planHeader}>
            <Text style={[styles.planDay, { color: theme.colors.current.textPrimary }]}>
              {generatedPlan.day}
            </Text>
            <Text style={[styles.planDate, { color: theme.colors.current.textSecondary }]}>
              {new Date(generatedPlan.generated_at).toLocaleDateString(undefined, { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          
          <View style={styles.timelineContainer}>
            {generatedPlan.blocks.map((block, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timeContainer}>
                  <Text style={[styles.timeText, { color: theme.colors.primary.main }]}>
                    {block.time}
                  </Text>
                </View>
                
                <View style={[
                  styles.timelineContent,
                  { borderColor: theme.colors.current.border }
                ]}>
                  <View style={styles.timelineDot} />
                  <View style={styles.blockHeader}>
                    <Text style={[styles.blockTitle, { color: theme.colors.current.textPrimary }]}>
                      {block.title}
                    </Text>
                    {renderPriorityBadge(block.priority)}
                  </View>
                  
                  {block.description && (
                    <Text style={[styles.blockDescription, { color: theme.colors.current.textSecondary }]}>
                      {block.description}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, { borderColor: theme.colors.current.border }]}
              onPress={() => {
                // Save functionality would go here
                Alert.alert('Success', 'Plan saved to your history');
                // Track save action
                planAnalytics.trackPlanViewed(generatedPlan?.generated_at || 'unknown', {
                  action: 'save'
                });
              }}
            >
              <FontAwesome name="save" size={20} color={theme.colors.current.textPrimary} />
              <Text style={[styles.actionText, { color: theme.colors.current.textPrimary }]}>
                Save
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { borderColor: theme.colors.current.border }]}
              onPress={async () => {
                try {
                  // Format the plan content for sharing
                  const dayTitle = generatedPlan?.day || 'Daily Plan';
                  const formattedDate = new Date(generatedPlan?.generated_at || new Date()).toLocaleDateString();
                  
                  // Create a text representation of the plan
                  let shareText = `${dayTitle} (${formattedDate})\n\n`;
                  
                  // Add each time block
                  generatedPlan?.blocks.forEach(block => {
                    shareText += `${block.time} - ${block.title}\n`;
                    if (block.description) {
                      shareText += `${block.description}\n`;
                    }
                    shareText += '\n';
                  });
                  
                  // Add app attribution
                  shareText += '\nGenerated with MuhsinAI';
                  
                  // Use Share API to share the plan
                  await Share.share({
                    message: shareText
                  });
                  
                  // Track share event
                  planAnalytics.trackPlanViewed('new_plan', { action: 'share' });
                } catch (error) {
                  Alert.alert('Error', 'Failed to share the plan');
                }
              }}
            >
              <FontAwesome name="share" size={20} color={theme.colors.current.textPrimary} />
              <Text style={[styles.actionText, { color: theme.colors.current.textPrimary }]}>
                Share
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { borderColor: theme.colors.current.border }]}
              onPress={() => setGeneratedPlan(null)}
            >
              <FontAwesome name="refresh" size={20} color={theme.colors.current.textPrimary} />
              <Text style={[styles.actionText, { color: theme.colors.current.textPrimary }]}>
                New Plan
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyStateContainer}>
          <FontAwesome name="calendar-plus-o" size={60} color={theme.colors.current.textSecondary} />
          <Text style={[styles.emptyStateTitle, { color: theme.colors.current.textPrimary }]}>
            Create Your Daily Plan
          </Text>
          <Text style={[styles.emptyStateText, { color: theme.colors.current.textSecondary }]}>
            Describe your day and tasks above, and MuhsinAI will create a structured plan with prayer times included.
          </Text>
          
          <View style={styles.exampleContainer}>
            <Text style={[styles.exampleTitle, { color: theme.colors.primary.main }]}>
              Example Prompts:
            </Text>
            <Text style={[styles.exampleText, { color: theme.colors.current.textSecondary }]}>
              • "Create a productive work day with focus time in the morning"
            </Text>
            <Text style={[styles.exampleText, { color: theme.colors.current.textSecondary }]}>
              • "Plan a balanced day with study, exercise, and family time"
            </Text>
            <Text style={[styles.exampleText, { color: theme.colors.current.textSecondary }]}>
              • "Schedule my day with prayer times for NYC and 3 hours of deep work"
            </Text>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  inputContainer: {
    padding: 16,
  },
  input: {
    height: 120,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 8,
  },
  generateButton: {
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  exampleContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    marginBottom: 6,
  },
  planContainer: {
    flex: 1,
  },
  planContent: {
    padding: 16,
    paddingBottom: 32,
  },
  planHeader: {
    marginBottom: 24,
  },
  planDay: {
    fontSize: 24,
    fontWeight: '700',
  },
  planDate: {
    fontSize: 16,
  },
  timelineContainer: {
    marginBottom: 24,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timeContainer: {
    width: 70,
    marginRight: 12,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timelineContent: {
    flex: 1,
    borderLeftWidth: 1,
    paddingLeft: 20,
    paddingBottom: 16,
    position: 'relative',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    position: 'absolute',
    left: -6,
    top: 0,
  },
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  blockDescription: {
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});
