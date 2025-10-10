import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { usePlanAnalytics, useScreenTracking } from './lib/analytics/analytics.hooks';
import { supabase } from './lib/auth/client';
import { useAuth } from './lib/auth/provider';
import { useTheme } from './theme/ThemeProvider';

// Types for plan data
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

interface Plan {
  id: string;
  title: string;
  created_at: string;
  content_json: PlanData;
  prompt: string;
}

export default function PlanDetail() {
  const params = useLocalSearchParams();
  const planId = params.id as string;
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAuth();
  const planAnalytics = usePlanAnalytics();
  
  // Track screen view
  useScreenTracking('plan_detail', { plan_id: planId });
  
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load plan data when component mounts
  useEffect(() => {
    if (user && planId) {
      fetchPlanDetails();
    }
  }, [planId, user]);
  
  // Track plan viewed when plan is loaded
  useEffect(() => {
    if (plan) {
      planAnalytics.trackPlanViewed(plan.id, { 
        view_type: 'detail',
        day: plan.content_json?.day
      });
    }
  }, [plan]);

  // Fetch plan details from the database
  const fetchPlanDetails = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('id', planId)
        .single();
        
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error('Plan not found');
      }
      
      setPlan(data as Plan);
    } catch (err: any) {
      console.error('Error fetching plan details:', err);
      setError('Failed to load the plan. Please try again.');
      
      planAnalytics.trackPlanError('detail_fetch_error', {
        plan_id: planId,
        error: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sharing the plan
  const handleSharePlan = async () => {
    if (!plan) return;
    
    try {
      // Format the plan content for sharing
      const dayTitle = plan.content_json?.day || 'Daily Plan';
      const formattedDate = new Date(plan.created_at).toLocaleDateString();
      
      // Create a text representation of the plan
      let shareText = `${dayTitle} (${formattedDate})\n\n`;
      
      // Add each time block
      plan.content_json.blocks.forEach(block => {
        shareText += `${block.time} - ${block.title}\n`;
        if (block.description) {
          shareText += `${block.description}\n`;
        }
        shareText += '\n';
      });
      
      // Add app attribution
      shareText += '\nGenerated with MuhsinAI';
      
      // Use Share API to share the plan
      const result = await Share.share({
        message: shareText
      });
      
      if (result.action === Share.sharedAction) {
        planAnalytics.trackPlanViewed(plan.id, {
          action: 'share',
          result: 'completed'
        });
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to share the plan');
      planAnalytics.trackPlanError('share_error', {
        plan_id: plan.id,
        error: error.message
      });
    }
  };

  // Delete the plan
  const handleDeletePlan = async () => {
    try {
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', planId);
        
      if (error) {
        throw error;
      }
      
      // Show success message and navigate back to history
      Alert.alert('Plan Deleted', 'The plan has been removed from your history.');
      router.back();
      
      planAnalytics.trackPlanViewed(planId, {
        action: 'delete'
      });
    } catch (err: any) {
      console.error('Error deleting plan:', err);
      Alert.alert('Error', 'Failed to delete the plan. Please try again.');
      
      planAnalytics.trackPlanError('delete_error', {
        plan_id: planId,
        error: err.message
      });
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

  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.current.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={[styles.loadingText, { color: theme.colors.current.textSecondary }]}>
            Loading plan...
          </Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error || !plan) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.current.background }]}>
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-circle" size={60} color={theme.colors.error.main} />
          <Text style={[styles.errorTitle, { color: theme.colors.current.textPrimary }]}>
            Error Loading Plan
          </Text>
          <Text style={[styles.errorText, { color: theme.colors.error.main }]}>
            {error || 'Plan not found'}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { borderColor: theme.colors.primary.main }]}
            onPress={fetchPlanDetails}
          >
            <Text style={[styles.retryText, { color: theme.colors.primary.main }]}>
              Try Again
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.backButton, { marginTop: 16 }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backText, { color: theme.colors.current.textSecondary }]}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.current.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Plan Header */}
        <View style={styles.planHeader}>
          <Text style={[styles.planDay, { color: theme.colors.current.textPrimary }]}>
            {plan.content_json?.day || 'Daily Plan'}
          </Text>
          <Text style={[styles.planDate, { color: theme.colors.current.textSecondary }]}>
            {new Date(plan.created_at).toLocaleDateString(undefined, { 
              weekday: 'long',
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>
        
        {/* Original Prompt */}
        {plan.prompt && (
          <View style={[styles.promptContainer, { backgroundColor: theme.colors.current.surface }]}>
            <Text style={[styles.promptLabel, { color: theme.colors.primary.main }]}>
              Original Request:
            </Text>
            <Text style={[styles.promptText, { color: theme.colors.current.textPrimary }]}>
              {plan.prompt}
            </Text>
          </View>
        )}
        
        {/* Timeline View */}
        <View style={styles.timelineContainer}>
          {plan.content_json?.blocks?.map((block, index) => (
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
                <View style={[styles.timelineDot, { backgroundColor: theme.colors.primary.main }]} />
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
      </ScrollView>
      
      {/* Action Buttons */}
      <View style={[styles.actionsContainer, { borderTopColor: theme.colors.current.border }]}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.colors.primary.main }]}
          onPress={handleSharePlan}
        >
          <FontAwesome name="share" size={18} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Share Plan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.colors.error.main }]}
          onPress={() => {
            Alert.alert(
              'Delete Plan',
              'Are you sure you want to delete this plan?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: handleDeletePlan }
              ]
            );
          }}
        >
          <FontAwesome name="trash" size={18} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
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
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '500',
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  backText: {
    fontSize: 16,
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
  promptContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  promptLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  promptText: {
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
    paddingTop: 2,
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
    position: 'absolute',
    left: -6,
    top: 4,
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
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});