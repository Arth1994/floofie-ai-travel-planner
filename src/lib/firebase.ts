/**
 * Firebase Configuration and Authentication Setup
 * Handles Google Sign-In and user management
 */

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';

// Firebase configuration - all credentials must be set via environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore with error handling - using floofie-db database
let db: any = null;
try {
  db = getFirestore(app, 'floofie-db');
  console.log('✅ Firestore initialized successfully with database: floofie-db');
} catch (error) {
  console.warn('⚠️ Firestore initialization failed:', error);
  console.log('📝 Please configure Firestore database "floofie-db" in Firebase Console');
}

export { db };

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Save user data to Firestore
    await saveUserToFirestore(user);
    
    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

/**
 * Sign out
 */
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// ========================================
// DATABASE INTERFACES
// ========================================

export interface UserPreferences {
  defaultTheme: string;
  defaultBudget: number;
  defaultDuration: number;
  preferredDestinations: string[];
  dietaryRestrictions: string[];
  favoriteActivityTypes: string[];
}

export interface ItineraryData {
  id?: string;
  userId: string;
  destination: string;
  duration: number;
  budget: string;
  theme: string;
  dietary: string;
  itinerary: any; // The full itinerary object
  userRating?: number; // 1-5 stars
  userFeedback?: string;
  isPublic: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  version: number;
  // ML Training Data
  clickedActivities: string[];
  timeSpentViewing: number; // seconds
  bookingsMade: string[];
  sharingCount: number;
}

export interface UserBehavior {
  userId: string;
  sessionId: string;
  action: 'view' | 'click' | 'book' | 'save' | 'share' | 'rate';
  targetType: 'activity' | 'restaurant' | 'accommodation' | 'itinerary';
  targetId: string;
  metadata: Record<string, any>;
  timestamp: Timestamp;
}

/**
 * Save user data to Firestore
 */
export const saveUserToFirestore = async (user: User): Promise<void> => {
  if (!db) {
    console.warn('Firestore not available, skipping user save');
    return;
  }
  
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // New user - create profile
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        isAdmin: false,
        preferences: {
          defaultTheme: 'Spa & Wellness',
          defaultBudget: 1500,
          defaultDuration: 3,
          preferredDestinations: [],
          dietaryRestrictions: ['Any'],
          favoriteActivityTypes: []
        } as UserPreferences,
        totalItineraries: 0,
        totalBookings: 0,
        reputationScore: 0
      });
    } else {
      // Existing user - update last login
      await setDoc(userRef, {
        lastLoginAt: serverTimestamp()
      }, { merge: true });
    }
  } catch (error) {
    console.error('Error saving user to Firestore:', error);
  }
};

// ========================================
// ITINERARY MANAGEMENT
// ========================================

/**
 * Save an itinerary to Firestore
 */
export const saveItinerary = async (
  userId: string,
  itineraryData: any,
  formData: {
    destination: string;
    duration: number;
    budget: string;
    theme: string;
    dietary: string;
  }
): Promise<string> => {
  if (!db) {
    throw new Error('Firestore not initialized. Please configure Firestore in Firebase Console.');
  }
  
  try {
    const itineraryToSave: Omit<ItineraryData, 'id'> = {
      userId,
      destination: formData.destination,
      duration: formData.duration,
      budget: formData.budget,
      theme: formData.theme,
      dietary: formData.dietary,
      itinerary: itineraryData,
      isPublic: false,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
      version: 1,
      clickedActivities: [],
      timeSpentViewing: 0,
      bookingsMade: [],
      sharingCount: 0
    };

    const docRef = await addDoc(collection(db, 'itineraries'), itineraryToSave);
    
    // Update user's itinerary count
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      totalItineraries: (await getDoc(userRef)).data()?.totalItineraries + 1 || 1,
      'preferences.preferredDestinations': formData.destination
    });

    console.log('Itinerary saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving itinerary:', error);
    throw error;
  }
};

/**
 * Get user's itineraries
 */
export const getUserItineraries = async (userId: string, limitCount: number = 10): Promise<ItineraryData[]> => {
  if (!db) {
    console.warn('Firestore not available, returning empty array');
    return [];
  }
  
  try {
    const q = query(
      collection(db, 'itineraries'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const itineraries: ItineraryData[] = [];
    
    querySnapshot.forEach((doc) => {
      itineraries.push({ id: doc.id, ...doc.data() } as ItineraryData);
    });
    
    return itineraries;
  } catch (error) {
    console.error('Error getting user itineraries:', error);
    return [];
  }
};

/**
 * Get public itineraries for inspiration
 */
export const getPublicItineraries = async (limitCount: number = 20): Promise<ItineraryData[]> => {
  try {
    const q = query(
      collection(db, 'itineraries'),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const itineraries: ItineraryData[] = [];
    
    querySnapshot.forEach((doc) => {
      itineraries.push({ id: doc.id, ...doc.data() } as ItineraryData);
    });
    
    return itineraries;
  } catch (error) {
    console.error('Error getting public itineraries:', error);
    return [];
  }
};

/**
 * Track user behavior for ML training
 */
export const trackUserBehavior = async (
  userId: string,
  sessionId: string,
  action: UserBehavior['action'],
  targetType: UserBehavior['targetType'],
  targetId: string,
  metadata: Record<string, any> = {}
): Promise<void> => {
  if (!db) {
    console.warn('Firestore not available, skipping behavior tracking');
    return;
  }
  
  try {
    const behaviorData: Omit<UserBehavior, 'id'> = {
      userId,
      sessionId,
      action,
      targetType,
      targetId,
      metadata,
      timestamp: serverTimestamp() as Timestamp
    };

    await addDoc(collection(db, 'user_behavior'), behaviorData);
  } catch (error) {
    console.error('Error tracking user behavior:', error);
  }
};

/**
 * Update itinerary with user feedback
 */
export const updateItineraryFeedback = async (
  itineraryId: string,
  userId: string,
  rating: number,
  feedback?: string
): Promise<void> => {
  try {
    const itineraryRef = doc(db, 'itineraries', itineraryId);
    await updateDoc(itineraryRef, {
      userRating: rating,
      userFeedback: feedback,
      updatedAt: serverTimestamp()
    });

    // Track the rating action
    await trackUserBehavior(userId, `session_${Date.now()}`, 'rate', 'itinerary', itineraryId, {
      rating,
      feedback: feedback || ''
    });
  } catch (error) {
    console.error('Error updating itinerary feedback:', error);
    throw error;
  }
};

/**
 * Get user data from Firestore
 */
export const getUserData = async (uid: string) => {
  if (!db) {
    console.warn('Firestore not available, returning null for user data');
    return null;
  }
  
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Auth state change listener
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

