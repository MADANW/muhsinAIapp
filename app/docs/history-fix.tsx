/**
 * Fix for the history.tsx file
 * 
 * This file provides a corrected implementation of the history screen with proper animation
 * support and structured rendering of plan items.
 * 
 * To apply: Copy this content to replace the existing history.tsx file
 */

import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { usePlanAnalytics, useScreenTracking } from './lib/analytics/analytics.hooks';
import * as Animations from './lib/animations';
import { supabase } from './lib/auth/client';
import { useAuth } from './lib/auth/provider';
import AnimatedCard from './lib/components/AnimatedCard';
import { useTheme } from './theme/ThemeProvider';

// Types for plan data
interface Plan {
  id: string;
  title: string;
  created_at: string;
  content_json: {
    day: string;
    blocks: {
      time: string;
      title: string;
    }[];
  };
}

export default function History() {
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAuth();
  const planAnalytics = usePlanAnalytics();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  
  // Track this screen view
  useScreenTracking('history');
  
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load plans when the component mounts
  useEffect(() => {
    if (user) {
      fetchPlans();
    }
  }, [user]);
  
  // Run entry animations when component mounts
  useEffect(() => {
    // Animate the component into view
    Animated.parallel([
      Animations.fadeIn(fadeAnim, 500),
      Animations.scale(scaleAnim, 1, 500),
      Animations.translate(translateYAnim, 0, 500)
    ]).start();
    
    return () => {
      // Reset animation values on unmount
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.95);
      translateYAnim.setValue(20);
    };
  }, [fadeAnim, scaleAnim, translateYAnim]);

  // Fetch user's plans from the database
  const fetchPlans = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setPlans(data || []);
      
      // Track successful plans fetch
      planAnalytics.trackPlanViewed('history_view', {
        count: data?.length || 0,
        action: 'list_view'
      });
    } catch (err: any) {
      console.error('Error fetching plans:', err);
      setError('Failed to load your plans. Please try again.');
      
      // Track error
      planAnalytics.trackPlanError('history_fetch_error', {
        error: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a plan
  const handleDeletePlan = async (planId: string) => {
    try {
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', planId);
        
      if (error) {
        throw error;
      }
      
      // Remove the deleted plan from state
      setPlans(plans.filter(plan => plan.id !== planId));
      
      // Show success message
      Alert.alert('Plan Deleted', 'The plan has been removed from your history.');
    } catch (err: any) {
      console.error('Error deleting plan:', err);
      Alert.alert('Error', 'Failed to delete the plan. Please try again.');
    }
  };

  // View a plan's details
  const handleViewPlan = (plan: Plan) => {
    // Track plan view event
    planAnalytics.trackPlanViewed(plan.id, {
      source: 'history',
      day: plan.content_json?.day
    });
    
    // Navigate to plan detail view
    router.push({
      pathname: '/plan-detail',
      params: { id: plan.id }
    } as any);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render each plan item
  const renderPlanItem = ({ item, index }: { item: Plan; index: number }) => {
    // Get the first few blocks to preview
    const previewBlocks = item.content_json?.blocks?.slice(0, 3) || [];
    
    return (
      <AnimatedCard 
        index={index} 
        duration={400}
        style={styles.cardContainer}
      >
        <TouchableOpacity
          style={[styles.planCard, { backgroundColor: theme.colors.current.surface }]}
          onPress={() => handleViewPlan(item)}
        >
          <View style={styles.planHeader}>
            <Text 
              style={[styles.planTitle, { color: theme.colors.current.textPrimary }]}
              numberOfLines={1}
            >
              {item.content_json?.day || 'Daily Plan'}
            </Text>
            <Text style={[styles.planDate, { color: theme.colors.current.textSecondary }]}>
              {formatDate(item.created_at)}
            </Text>
          </View>
          
          <View style={styles.planPreview}>
            {previewBlocks.map((block, index) => (
              <View key={index} style={styles.previewItem}>
                <Text style={[styles.previewTime, { color: theme.colors.primary.main }]}>
                  {block.time}
                </Text>
                <Text 
                  style={[styles.previewTitle, { color: theme.colors.current.textPrimary }]}
                  numberOfLines={1}
                >
                  {block.title}
                </Text>
              </View>
            ))}
            
            {previewBlocks.length > 0 && (
              <Text style={[styles.showMore, { color: theme.colors.current.textSecondary }]}>
                Tap to view full plan...
              </Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => {
              Alert.alert(
                'Delete Plan',
                'Are you sure you want to delete this plan?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => handleDeletePlan(item.id) }
                ]
              );
            }}
          >
            <FontAwesome name="trash-o" size={16} color={theme.colors.error.main} />
          </TouchableOpacity>
        </TouchableOpacity>
      </AnimatedCard>
    );
  };

  // Empty state component
  const EmptyState = () => (
    <View style={styles.emptyState}>
      <FontAwesome name="history" size={60} color={theme.colors.current.textSecondary} />
      <Text style={[styles.emptyTitle, { color: theme.colors.current.textPrimary }]}>
        No Plans Yet
      </Text>
      <Text style={[styles.emptyText, { color: theme.colors.current.textSecondary }]}>
        Create your first plan to see it here.
      </Text>
      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: theme.colors.primary.main }]}
        onPress={() => router.push('/plan' as any)}
      >
        <Text style={styles.createButtonText}>Create New Plan</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.current.background,
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim }
          ]
        }
      ]}
    >
      <View style={[styles.header, { borderBottomColor: theme.colors.current.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.current.textPrimary }]}>
          Plan History
        </Text>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={[styles.loadingText, { color: theme.colors.current.textSecondary }]}>
            Loading your plans...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error.main }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { borderColor: theme.colors.primary.main }]}
            onPress={fetchPlans}
          >
            <Text style={[styles.retryText, { color: theme.colors.primary.main }]}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={plans}
          renderItem={renderPlanItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={EmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      {!isLoading && plans.length > 0 && (
        <TouchableOpacity
          style={[styles.floatingButton, { backgroundColor: theme.colors.primary.main }]}
          onPress={() => router.push('/plan' as any)}
        >
          <FontAwesome name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  createButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  cardContainer: {
    marginBottom: 16,
  },
  planCard: {
    borderRadius: 12,
    padding: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  planHeader: {
    marginBottom: 12,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  planDate: {
    fontSize: 14,
  },
  planPreview: {
    marginTop: 8,
  },
  previewItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  previewTime: {
    fontSize: 14,
    fontWeight: '500',
    width: 70,
  },
  previewTitle: {
    fontSize: 14,
    flex: 1,
  },
  showMore: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});