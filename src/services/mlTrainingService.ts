/**
 * ML Training Service for Floofie Travel AI
 * Analyzes user behavior and itinerary data to improve recommendations
 */

import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db, ItineraryData, UserBehavior } from '../lib/firebase';

// ========================================
// TRAINING DATA INTERFACES
// ========================================

export interface TrainingDataPoint {
  userId: string;
  userProfile: UserProfile;
  itineraryInput: ItineraryInput;
  itineraryOutput: ItineraryOutput;
  userFeedback: UserFeedback;
  behaviorMetrics: BehaviorMetrics;
}

export interface UserProfile {
  age?: number;
  gender?: string;
  travelExperience: 'beginner' | 'intermediate' | 'expert';
  preferredDestinations: string[];
  dietaryRestrictions: string[];
  budgetRange: string;
  travelStyle: string[];
  seasonalPreferences: string[];
}

export interface ItineraryInput {
  destination: string;
  duration: number;
  budget: string;
  theme: string;
  dietary: string;
  travelDates?: string;
  groupSize?: number;
}

export interface ItineraryOutput {
  activities: ActivityRecommendation[];
  restaurants: RestaurantRecommendation[];
  accommodations: AccommodationRecommendation[];
  totalCost: number;
  themes: string[];
}

export interface ActivityRecommendation {
  name: string;
  type: string;
  location: string;
  cost: number;
  duration: number;
  rating: number;
  popularity: number;
}

export interface RestaurantRecommendation {
  name: string;
  cuisine: string;
  dietary: string[];
  priceRange: string;
  rating: number;
  reviews: number;
}

export interface AccommodationRecommendation {
  name: string;
  type: string;
  pricePerNight: number;
  rating: number;
  amenities: string[];
}

export interface UserFeedback {
  overallRating: number;
  aspectRatings: {
    activities: number;
    dining: number;
    accommodation: number;
    budget: number;
    logistics: number;
  };
  textFeedback?: string;
  wouldRecommend: boolean;
}

export interface BehaviorMetrics {
  timeSpentViewing: number;
  clickedItems: string[];
  bookingsMade: string[];
  sharingCount: number;
  returnVisits: number;
  completionRate: number;
}

// ========================================
// ML TRAINING SERVICE
// ========================================

export class MLTrainingService {
  private static instance: MLTrainingService;

  private constructor() {}

  static getInstance(): MLTrainingService {
    if (!MLTrainingService.instance) {
      MLTrainingService.instance = new MLTrainingService();
    }
    return MLTrainingService.instance;
  }

  /**
   * Collect all training data from Firestore
   */
  async collectTrainingData(limitCount: number = 1000): Promise<TrainingDataPoint[]> {
    try {
      console.log('🤖 Collecting training data from Firestore...');
      
      // Get all itineraries with user feedback
      const itinerariesQuery = query(
        collection(db, 'itineraries'),
        where('userRating', '>=', 1),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const itinerariesSnapshot = await getDocs(itinerariesQuery);
      const trainingData: TrainingDataPoint[] = [];
      
      for (const doc of itinerariesSnapshot.docs) {
        const itinerary = { id: doc.id, ...doc.data() } as ItineraryData;
        
        // Get user behavior for this itinerary
        const behaviorQuery = query(
          collection(db, 'user_behavior'),
          where('userId', '==', itinerary.userId),
          where('targetId', '==', doc.id)
        );
        
        const behaviorSnapshot = await getDocs(behaviorQuery);
        const behaviors: UserBehavior[] = [];
        
        behaviorSnapshot.forEach((behaviorDoc) => {
          behaviors.push(behaviorDoc.data() as UserBehavior);
        });
        
        // Convert to training data point
        const trainingPoint = await this.convertToTrainingData(itinerary, behaviors);
        if (trainingPoint) {
          trainingData.push(trainingPoint);
        }
      }
      
      console.log(`✅ Collected ${trainingData.length} training data points`);
      return trainingData;
    } catch (error) {
      console.error('❌ Error collecting training data:', error);
      return [];
    }
  }

  /**
   * Convert itinerary and behavior data to training format
   */
  private async convertToTrainingData(
    itinerary: ItineraryData, 
    behaviors: UserBehavior[]
  ): Promise<TrainingDataPoint | null> {
    try {
      // Extract user profile (simplified for now)
      const userProfile: UserProfile = {
        travelExperience: 'intermediate', // Default
        preferredDestinations: [itinerary.destination],
        dietaryRestrictions: [itinerary.dietary],
        budgetRange: itinerary.budget,
        travelStyle: [itinerary.theme],
        seasonalPreferences: []
      };

      // Extract itinerary input
      const itineraryInput: ItineraryInput = {
        destination: itinerary.destination,
        duration: itinerary.duration,
        budget: itinerary.budget,
        theme: itinerary.theme,
        dietary: itinerary.dietary
      };

      // Extract itinerary output
      const itineraryOutput: ItineraryOutput = {
        activities: this.extractActivities(itinerary.itinerary),
        restaurants: this.extractRestaurants(itinerary.itinerary),
        accommodations: this.extractAccommodations(itinerary.itinerary),
        totalCost: this.extractTotalCost(itinerary.itinerary),
        themes: [itinerary.theme]
      };

      // Extract user feedback
      const userFeedback: UserFeedback = {
        overallRating: itinerary.userRating || 0,
        aspectRatings: {
          activities: itinerary.userRating || 0,
          dining: itinerary.userRating || 0,
          accommodation: itinerary.userRating || 0,
          budget: itinerary.userRating || 0,
          logistics: itinerary.userRating || 0
        },
        textFeedback: itinerary.userFeedback,
        wouldRecommend: (itinerary.userRating || 0) >= 4
      };

      // Extract behavior metrics
      const behaviorMetrics: BehaviorMetrics = {
        timeSpentViewing: itinerary.timeSpentViewing,
        clickedItems: itinerary.clickedActivities,
        bookingsMade: itinerary.bookingsMade,
        sharingCount: itinerary.sharingCount,
        returnVisits: behaviors.filter(b => b.action === 'view').length,
        completionRate: this.calculateCompletionRate(behaviors)
      };

      return {
        userId: itinerary.userId,
        userProfile,
        itineraryInput,
        itineraryOutput,
        userFeedback,
        behaviorMetrics
      };
    } catch (error) {
      console.error('Error converting to training data:', error);
      return null;
    }
  }

  /**
   * Extract activities from itinerary
   */
  private extractActivities(itinerary: any): ActivityRecommendation[] {
    const activities: ActivityRecommendation[] = [];
    
    if (itinerary?.days) {
      itinerary.days.forEach((day: any) => {
        ['morning', 'afternoon', 'evening'].forEach(timeSlot => {
          const activity = day[timeSlot];
          if (activity) {
            activities.push({
              name: activity.name || 'Unknown Activity',
              type: activity.type || 'Activity',
              location: activity.address || 'Unknown',
              cost: this.parseCost(activity.cost),
              duration: 2, // Default 2 hours
              rating: activity.rating || 4.0,
              popularity: Math.random() * 100 // Placeholder
            });
          }
        });
      });
    }
    
    return activities;
  }

  /**
   * Extract restaurants from itinerary
   */
  private extractRestaurants(itinerary: any): RestaurantRecommendation[] {
    const restaurants: RestaurantRecommendation[] = [];
    
    if (itinerary?.days) {
      itinerary.days.forEach((day: any) => {
        if (day.dining) {
          ['breakfast', 'lunch', 'dinner'].forEach(meal => {
            const restaurant = day.dining[meal];
            if (restaurant) {
              restaurants.push({
                name: restaurant.name || 'Unknown Restaurant',
                cuisine: restaurant.type || 'International',
                dietary: [restaurant.dietary || 'Any'],
                priceRange: restaurant.price || '$20-40',
                rating: restaurant.rating || 4.0,
                reviews: restaurant.reviews || 100
              });
            }
          });
        }
      });
    }
    
    return restaurants;
  }

  /**
   * Extract accommodations from itinerary
   */
  private extractAccommodations(itinerary: any): AccommodationRecommendation[] {
    const accommodations: AccommodationRecommendation[] = [];
    
    if (itinerary?.days?.[0]?.accommodation) {
      const accommodation = itinerary.days[0].accommodation;
      accommodations.push({
        name: accommodation.name || 'Unknown Hotel',
        type: accommodation.type || 'Hotel',
        pricePerNight: this.parseCost(accommodation.price),
        rating: accommodation.rating || 4.0,
        amenities: ['WiFi', 'Breakfast'] // Placeholder
      });
    }
    
    return accommodations;
  }

  /**
   * Extract total cost from itinerary
   */
  private extractTotalCost(itinerary: any): number {
    return this.parseCost(itinerary?.totalCost) || 1500;
  }

  /**
   * Parse cost string to number
   */
  private parseCost(costStr: string): number {
    if (!costStr) return 0;
    const match = costStr.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }

  /**
   * Calculate completion rate from behaviors
   */
  private calculateCompletionRate(behaviors: UserBehavior[]): number {
    const totalActions = behaviors.length;
    const completionActions = behaviors.filter(b => 
      ['book', 'save', 'share'].includes(b.action)
    ).length;
    
    return totalActions > 0 ? completionActions / totalActions : 0;
  }

  /**
   * Analyze user preferences from training data
   */
  async analyzeUserPreferences(userId: string): Promise<UserProfile | null> {
    try {
      // Get user's past itineraries
      const userItinerariesQuery = query(
        collection(db, 'itineraries'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      
      const snapshot = await getDocs(userItinerariesQuery);
      const itineraries: ItineraryData[] = [];
      
      snapshot.forEach(doc => {
        itineraries.push({ id: doc.id, ...doc.data() } as ItineraryData);
      });
      
      if (itineraries.length === 0) return null;
      
      // Analyze patterns
      const destinations = itineraries.map(i => i.destination);
      const themes = itineraries.map(i => i.theme);
      const budgets = itineraries.map(i => i.budget);
      const dietary = itineraries.map(i => i.dietary);
      
      const profile: UserProfile = {
        travelExperience: itineraries.length > 5 ? 'expert' : 
                         itineraries.length > 2 ? 'intermediate' : 'beginner',
        preferredDestinations: [...new Set(destinations)],
        dietaryRestrictions: [...new Set(dietary)],
        budgetRange: this.getMostCommon(budgets),
        travelStyle: [...new Set(themes)],
        seasonalPreferences: []
      };
      
      return profile;
    } catch (error) {
      console.error('Error analyzing user preferences:', error);
      return null;
    }
  }

  /**
   * Get most common value from array
   */
  private getMostCommon(arr: string[]): string {
    const counts = arr.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.keys(counts).reduce((a, b) => 
      counts[a] > counts[b] ? a : b, arr[0]
    );
  }

  /**
   * Generate personalized recommendations based on ML analysis
   */
  async generatePersonalizedRecommendations(
    userId: string,
    input: ItineraryInput
  ): Promise<{
    recommendedThemes: string[];
    recommendedBudget: string;
    popularActivities: string[];
    dietaryTips: string[];
  }> {
    try {
      const userProfile = await this.analyzeUserPreferences(userId);
      const trainingData = await this.collectTrainingData(100);
      
      // Find similar users
      const similarUsers = this.findSimilarUsers(userProfile, trainingData);
      
      // Analyze what similar users liked
      const recommendations = this.extractRecommendations(similarUsers, input);
      
      return recommendations;
    } catch (error) {
      console.error('Error generating personalized recommendations:', error);
      return {
        recommendedThemes: ['Spa & Wellness'],
        recommendedBudget: '$1000-2000',
        popularActivities: ['Cultural Sites', 'Local Dining'],
        dietaryTips: ['Try local specialties']
      };
    }
  }

  /**
   * Find users with similar preferences
   */
  private findSimilarUsers(
    userProfile: UserProfile | null, 
    trainingData: TrainingDataPoint[]
  ): TrainingDataPoint[] {
    if (!userProfile) return trainingData.slice(0, 10);
    
    return trainingData
      .filter(point => {
        // Calculate similarity score
        let score = 0;
        
        // Similar destinations
        const commonDestinations = point.userProfile.preferredDestinations
          .filter(d => userProfile.preferredDestinations.includes(d));
        score += commonDestinations.length * 2;
        
        // Similar travel style
        const commonStyles = point.userProfile.travelStyle
          .filter(s => userProfile.travelStyle.includes(s));
        score += commonStyles.length * 3;
        
        // Similar budget
        if (point.userProfile.budgetRange === userProfile.budgetRange) {
          score += 2;
        }
        
        return score > 3; // Threshold for similarity
      })
      .sort((a, b) => b.userFeedback.overallRating - a.userFeedback.overallRating)
      .slice(0, 20);
  }

  /**
   * Extract recommendations from similar users
   */
  private extractRecommendations(
    similarUsers: TrainingDataPoint[],
    input: ItineraryInput
  ): {
    recommendedThemes: string[];
    recommendedBudget: string;
    popularActivities: string[];
    dietaryTips: string[];
  } {
    const themes = similarUsers.flatMap(u => u.itineraryOutput.themes);
    const activities = similarUsers.flatMap(u => 
      u.itineraryOutput.activities.map(a => a.type)
    );
    
    return {
      recommendedThemes: [...new Set(themes)].slice(0, 3),
      recommendedBudget: input.budget,
      popularActivities: [...new Set(activities)].slice(0, 5),
      dietaryTips: [
        'Try local specialties that match your dietary preferences',
        'Ask for ingredient lists at restaurants',
        'Consider local farmer markets for fresh options'
      ]
    };
  }
}

// Export singleton instance
export const mlTrainingService = MLTrainingService.getInstance();
