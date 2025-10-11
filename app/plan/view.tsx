import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { supabase } from '../lib/auth/client';
import { createError, getErrorMessage, PlanError } from '../lib/errors';
import { logger } from '../lib/logger';
import { useTheme } from '../theme/ThemeProvider';

// Plan data type definitions
interface TimeBlock {
  time: string;
  title: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
}

interface PlanContent {
  day: string;
  blocks: TimeBlock[];
  meta?: {
    source: string;
    version: number;
  };
  generated_at?: string;
}

interface Plan {
  id: string;
  content_json: PlanContent;
  created_at: string;
  source_input?: string;
}

export default function ViewPlan() {
  const params = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPlan = async () => {
      if (!params.id) {
        setError('Plan ID is required');
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error: fetchError } = await supabase
          .from('plans')
          .select('*')
          .eq('id', params.id)
          .single();
        
        if (fetchError) {
          throw fetchError;
        }
        
        if (!data) {
          throw new Error('Plan not found');
        }
        
        setPlan(data as unknown as Plan);
      } catch (err: unknown) {
        const planError = createError<PlanError>(
          'PLAN_ERROR',
          getErrorMessage(err),
          { planId: params.id }
        );
        
        logger.error('Error fetching plan:', planError);
        setError(planError.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlan();
  }, [params.id]);
  
  // Function to share the plan
  const handleShare = async () => {
    if (!plan) return;
    
    try {
      const planContent = plan.content_json;
      
      // Create a human-readable format
      let shareText = `MuhsinAI Daily Plan - ${planContent.day}\n\n`;
      
      planContent.blocks.forEach(block => {
        shareText += `${block.time}: ${block.title}\n`;
        if (block.description) {
          shareText += `${block.description}\n`;
        }
        shareText += '\n';
      });
      
      shareText += '\nGenerated with MuhsinAI - Your AI Daily Planner with Prayer Times';
      
      await Share.share({
        message: shareText,
        title: 'My Daily Plan from MuhsinAI',
      });
    } catch (err: unknown) {
      const appError = createError<PlanError>(
        'PLAN_ERROR',
        getErrorMessage(err),
        { planId: params.id }
      );
      
      logger.error('Share failed:', appError);
      Alert.alert('Sharing failed', appError.message);
    }
  };
  
  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <View style={[
        styles.loadingContainer,
        { backgroundColor: theme.colors.current.background }
      ]}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={[
          styles.loadingText,
          { color: theme.colors.current.textSecondary }
        ]}>
          Loading plan...
        </Text>
      </View>
    );
  }
  
  // Render error state
  if (error || !plan) {
    return (
      <View style={[
        styles.errorContainer,
        { backgroundColor: theme.colors.current.background }
      ]}>
        <Text style={[
          styles.errorText,
          { color: theme.colors.error.main }
        ]}>
          {error || 'Plan not found'}
        </Text>
        <TouchableOpacity
          style={[
            styles.errorButton,
            { backgroundColor: theme.colors.primary.main }
          ]}
          onPress={() => {
            // Go back to create screen
            window.history.back();
          }}
        >
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const planContent = plan.content_json;
  
  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.colors.current.background }
    ]}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[
            styles.date,
            { color: theme.colors.current.textSecondary }
          ]}>
            {formatDate(plan.created_at)}
          </Text>
          <Text style={[
            styles.title,
            { color: theme.colors.current.textPrimary }
          ]}>
            {planContent.day}
          </Text>
        </View>
        
        <View style={styles.timelineContainer}>
          {planContent.blocks.map((block, index) => (
            <View key={index} style={styles.timeBlock}>
              <View style={styles.timeColumn}>
                <Text style={[
                  styles.time,
                  { color: theme.colors.current.textSecondary }
                ]}>
                  {block.time}
                </Text>
                {index < planContent.blocks.length - 1 && (
                  <View style={[
                    styles.timeConnector,
                    { backgroundColor: theme.colors.current.border }
                  ]} />
                )}
              </View>
              
              <View style={[
                styles.contentCard,
                { 
                  backgroundColor: theme.colors.current.surface,
                  borderLeftColor: getPriorityColor(block.priority, theme)
                }
              ]}>
                <Text style={[
                  styles.activityTitle,
                  { color: theme.colors.current.textPrimary }
                ]}>
                  {block.title}
                </Text>
                {block.description && (
                  <Text style={[
                    styles.activityDescription,
                    { color: theme.colors.current.textSecondary }
                  ]}>
                    {block.description}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      
      <View style={[
        styles.actionBar,
        { backgroundColor: theme.colors.current.surface }
      ]}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.primary.main }
          ]}
          onPress={handleShare}
        >
          <Text style={styles.actionButtonText}>Share Plan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Helper function to get color based on priority
function getPriorityColor(priority: string | undefined, theme: any) {
  switch (priority) {
    case 'high':
      return theme.colors.error.main;
    case 'medium':
      return theme.colors.warning.main;
    case 'low':
      return theme.colors.success.main;
    default:
      return theme.colors.primary.main;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Add space for action bar
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    marginBottom: 24,
  },
  date: {
    fontSize: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  timelineContainer: {
    flex: 1,
  },
  timeBlock: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timeColumn: {
    width: 70,
    alignItems: 'center',
    marginRight: 12,
  },
  time: {
    fontSize: 14,
    fontWeight: '500',
  },
  timeConnector: {
    width: 2,
    flex: 1,
    marginTop: 8,
    marginBottom: -8,
  },
  contentCard: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  actionButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});