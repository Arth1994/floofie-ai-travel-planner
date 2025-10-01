/**
 * Custom hook for ML-driven recommendations
 * Provides personalized suggestions based on user behavior and saved itineraries
 */

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { mlTrainingService } from '../services/mlTrainingService';
import { type TravelFormData } from '../lib/validation';

interface MLRecommendations {
  recommendedThemes: string[];
  recommendedBudget: string;
  popularActivities: string[];
  dietaryTips: string[];
  personalizedSuggestions: string[];
}

interface UseMLRecommendationsReturn {
  recommendations: MLRecommendations | null;
  isLoading: boolean;
  error: string | null;
  refreshRecommendations: (formData?: Partial<TravelFormData>) => Promise<void>;
}

export const useMLRecommendations = (
  user: User | null,
  formData?: TravelFormData
): UseMLRecommendationsReturn => {
  const [recommendations, setRecommendations] = useState<MLRecommendations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshRecommendations = async (additionalFormData?: Partial<TravelFormData>) => {
    if (!user) {
      setRecommendations(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Merge form data
      const inputData = {
        destination: formData?.destination || additionalFormData?.destination || '',
        duration: formData?.duration || additionalFormData?.duration || 3,
        budget: formData?.budget || additionalFormData?.budget || '$1000-2000',
        theme: formData?.theme || additionalFormData?.theme || 'Spa & Wellness',
        dietary: formData?.dietary || additionalFormData?.dietary || 'Any'
      };

      // Get ML-powered recommendations
      const mlRecommendations = await mlTrainingService.generatePersonalizedRecommendations(
        user.uid,
        inputData
      );

      // Analyze user profile for additional insights
      const userProfile = await mlTrainingService.analyzeUserPreferences(user.uid);

      // Generate personalized suggestions based on analysis
      const personalizedSuggestions = generatePersonalizedSuggestions(userProfile, inputData);

      setRecommendations({
        ...mlRecommendations,
        personalizedSuggestions
      });

    } catch (err) {
      console.error('Error getting ML recommendations:', err);
      setError('Failed to get personalized recommendations');
      
      // Set fallback recommendations
      setRecommendations({
        recommendedThemes: ['Spa & Wellness', 'Cultural & Arts', 'Food & Dining'],
        recommendedBudget: formData?.budget || '$1000-2000',
        popularActivities: ['Local Museums', 'Traditional Restaurants', 'Walking Tours'],
        dietaryTips: ['Try local specialties', 'Ask about ingredients', 'Check restaurant reviews'],
        personalizedSuggestions: [
          'Based on popular choices, consider extending your trip by 1-2 days',
          'Spa treatments are highly rated in this destination',
          'Local food tours get excellent reviews from travelers'
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial recommendations when user or form data changes
  useEffect(() => {
    if (user && formData?.destination) {
      refreshRecommendations();
    }
  }, [user?.uid, formData?.destination, formData?.theme]);

  return {
    recommendations,
    isLoading,
    error,
    refreshRecommendations
  };
};

/**
 * Generate personalized suggestions based on user profile analysis
 */
function generatePersonalizedSuggestions(
  userProfile: any,
  formData: any
): string[] {
  const suggestions: string[] = [];

  if (!userProfile) {
    return [
      'Create more itineraries to get personalized recommendations',
      'Rate your experiences to help Floofie learn your preferences',
      'Try different themes to discover new interests'
    ];
  }

  // Experience-based suggestions
  if (userProfile.travelExperience === 'beginner') {
    suggestions.push('Consider booking guided tours for your first visits');
    suggestions.push('Leave extra time between activities for a relaxed pace');
  } else if (userProfile.travelExperience === 'expert') {
    suggestions.push('Explore off-the-beaten-path local experiences');
    suggestions.push('Consider staying in neighborhoods where locals live');
  }

  // Destination-based suggestions
  if (userProfile.preferredDestinations?.length > 0) {
    const favoriteDestination = userProfile.preferredDestinations[0];
    if (favoriteDestination !== formData.destination) {
      suggestions.push(`You loved ${favoriteDestination} - this destination has similar vibes!`);
    }
  }

  // Budget-based suggestions
  if (userProfile.budgetRange) {
    if (formData.budget !== userProfile.budgetRange) {
      suggestions.push(`Your usual budget is ${userProfile.budgetRange} - consider adjusting for the best experience`);
    }
  }

  // Activity-based suggestions
  if (userProfile.travelStyle?.length > 0) {
    const favoriteStyle = userProfile.travelStyle[0];
    if (favoriteStyle !== formData.theme) {
      suggestions.push(`You usually enjoy ${favoriteStyle} activities - we've included some similar options`);
    }
  }

  // Dietary suggestions
  if (userProfile.dietaryRestrictions?.length > 0) {
    const primaryDietary = userProfile.dietaryRestrictions[0];
    if (primaryDietary !== 'Any') {
      suggestions.push(`We've curated ${primaryDietary}-friendly dining options based on your preferences`);
    }
  }

  // Ensure we have at least some suggestions
  if (suggestions.length === 0) {
    suggestions.push(
      'Your travel history shows great taste - we\'ve included our top recommendations',
      'Based on your past ratings, you\'ll love the activities we\'ve selected',
      'We\'ve personalized this itinerary based on your previous feedback'
    );
  }

  return suggestions.slice(0, 3); // Limit to 3 suggestions
}

/**
 * Format recommendations for display
 */
export const formatRecommendations = (recommendations: MLRecommendations | null) => {
  if (!recommendations) return null;

  return {
    themes: recommendations.recommendedThemes.slice(0, 3),
    budget: recommendations.recommendedBudget,
    activities: recommendations.popularActivities.slice(0, 4),
    dietary: recommendations.dietaryTips.slice(0, 3),
    personal: recommendations.personalizedSuggestions.slice(0, 3)
  };
};
