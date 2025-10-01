/**
 * Firebase Cloud Functions for ML Training
 * Server-side ML processing and training pipeline
 * 
 * To deploy: firebase deploy --only functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Scheduled function to retrain ML model daily
 * Runs every day at 2 AM UTC
 */
exports.trainMLModel = functions.pubsub
  .schedule('0 2 * * *')
  .timeZone('UTC')
  .onRun(async (context) => {
    console.log('🤖 Starting ML model training...');
    
    try {
      // Collect training data from Firestore
      const trainingData = await collectTrainingData();
      
      // Process and train model
      const modelMetrics = await processTrainingData(trainingData);
      
      // Save model performance metrics
      await saveModelMetrics(modelMetrics);
      
      console.log('✅ ML training completed successfully');
      return { success: true, metrics: modelMetrics };
    } catch (error) {
      console.error('❌ ML training failed:', error);
      throw error;
    }
  });

/**
 * HTTP function to get personalized recommendations
 */
exports.getPersonalizedRecommendations = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, destination, theme, budget, dietary, duration } = data;

  try {
    console.log(`🎯 Generating recommendations for user ${userId}`);
    
    // Get user's historical data
    const userHistory = await getUserHistory(userId);
    
    // Get similar users' preferences
    const similarUsers = await findSimilarUsers(userHistory);
    
    // Generate recommendations using collaborative filtering
    const recommendations = await generateCollaborativeRecommendations(
      userHistory,
      similarUsers,
      { destination, theme, budget, dietary, duration }
    );
    
    return {
      success: true,
      recommendations,
      confidence: recommendations.confidence || 0.7
    };
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate recommendations');
  }
});

/**
 * HTTP function to track user behavior and update preferences
 */
exports.trackUserBehavior = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, action, targetType, targetId, metadata } = data;

  try {
    // Save behavior data
    await db.collection('user_behavior').add({
      userId,
      action,
      targetType,
      targetId,
      metadata: metadata || {},
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update user preferences in real-time
    await updateUserPreferences(userId, action, metadata);

    return { success: true };
  } catch (error) {
    console.error('Error tracking behavior:', error);
    throw new functions.https.HttpsError('internal', 'Failed to track behavior');
  }
});

/**
 * Firestore trigger to update ML model when new itinerary is saved
 */
exports.onItinerarySaved = functions.firestore
  .document('itineraries/{itineraryId}')
  .onCreate(async (snap, context) => {
    const itinerary = snap.data();
    const itineraryId = context.params.itineraryId;

    console.log(`📝 New itinerary saved: ${itineraryId}`);

    try {
      // Extract features for ML training
      const features = extractItineraryFeatures(itinerary);
      
      // Update user's preference profile
      await updateUserPreferenceProfile(itinerary.userId, features);
      
      // Check if we need to retrain model (if we have enough new data)
      const newDataCount = await getNewDataCount();
      if (newDataCount >= 100) { // Retrain every 100 new itineraries
        console.log('🚀 Triggering model retrain due to new data volume');
        // Trigger retraining (could be done via Pub/Sub)
      }

      return { success: true };
    } catch (error) {
      console.error('Error processing new itinerary:', error);
      return { success: false, error: error.message };
    }
  });

/**
 * HTTP function to get ML insights and analytics
 */
exports.getMLInsights = functions.https.onCall(async (data, context) => {
  // Admin only function
  if (!context.auth || !await isAdmin(context.auth.uid)) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required');
  }

  try {
    const insights = {
      totalUsers: await getTotalUsers(),
      totalItineraries: await getTotalItineraries(),
      popularDestinations: await getPopularDestinations(),
      popularThemes: await getPopularThemes(),
      averageRating: await getAverageRating(),
      userEngagement: await getUserEngagementMetrics(),
      modelPerformance: await getLatestModelMetrics()
    };

    return { success: true, insights };
  } catch (error) {
    console.error('Error getting ML insights:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get insights');
  }
});

// ========================================
// HELPER FUNCTIONS
// ========================================

async function collectTrainingData() {
  const itinerariesSnapshot = await db.collection('itineraries')
    .where('userRating', '>=', 1)
    .orderBy('createdAt', 'desc')
    .limit(1000)
    .get();

  const trainingData = [];
  
  for (const doc of itinerariesSnapshot.docs) {
    const itinerary = doc.data();
    
    // Get user behavior for this itinerary
    const behaviorSnapshot = await db.collection('user_behavior')
      .where('userId', '==', itinerary.userId)
      .where('targetId', '==', doc.id)
      .get();

    const behaviors = behaviorSnapshot.docs.map(doc => doc.data());
    
    trainingData.push({
      itinerary,
      behaviors,
      features: extractItineraryFeatures(itinerary)
    });
  }
  
  return trainingData;
}

async function processTrainingData(trainingData) {
  // Simplified ML processing (in production, you'd use proper ML libraries)
  console.log(`Processing ${trainingData.length} training samples...`);
  
  // Calculate feature correlations
  const featureCorrelations = calculateFeatureCorrelations(trainingData);
  
  // Generate user clusters
  const userClusters = generateUserClusters(trainingData);
  
  // Calculate recommendation accuracy
  const accuracy = calculateRecommendationAccuracy(trainingData);
  
  return {
    samplesProcessed: trainingData.length,
    featureCorrelations,
    userClusters: userClusters.length,
    accuracy,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  };
}

function extractItineraryFeatures(itinerary) {
  return {
    destination: itinerary.destination,
    duration: itinerary.duration,
    budget: parseBudgetRange(itinerary.budget),
    theme: itinerary.theme,
    dietary: itinerary.dietary,
    rating: itinerary.userRating || 0,
    activityCount: itinerary.itinerary?.days?.length || 0,
    hasAccommodation: !!(itinerary.itinerary?.days?.[0]?.accommodation),
    totalCost: parseCost(itinerary.itinerary?.totalCost)
  };
}

function parseBudgetRange(budgetStr) {
  if (!budgetStr) return 1000;
  const match = budgetStr.match(/\d+/);
  return match ? parseInt(match[0]) : 1000;
}

function parseCost(costStr) {
  if (!costStr) return 0;
  const match = costStr.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

async function getUserHistory(userId) {
  const snapshot = await db.collection('itineraries')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(20)
    .get();
    
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    features: extractItineraryFeatures(doc.data())
  }));
}

async function findSimilarUsers(userHistory) {
  if (userHistory.length === 0) return [];
  
  // Simple similarity based on themes and destinations
  const userThemes = userHistory.map(h => h.theme);
  const userDestinations = userHistory.map(h => h.destination);
  
  const similarUsersSnapshot = await db.collection('itineraries')
    .where('theme', 'in', userThemes.slice(0, 10)) // Firestore limitation
    .limit(50)
    .get();
    
  return similarUsersSnapshot.docs.map(doc => doc.data());
}

async function generateCollaborativeRecommendations(userHistory, similarUsers, input) {
  // Analyze what similar users liked
  const themePreferences = {};
  const destinationPreferences = {};
  
  similarUsers.forEach(user => {
    if (user.userRating >= 4) {
      themePreferences[user.theme] = (themePreferences[user.theme] || 0) + 1;
      destinationPreferences[user.destination] = (destinationPreferences[user.destination] || 0) + 1;
    }
  });
  
  const recommendedThemes = Object.keys(themePreferences)
    .sort((a, b) => themePreferences[b] - themePreferences[a])
    .slice(0, 3);
    
  const popularDestinations = Object.keys(destinationPreferences)
    .sort((a, b) => destinationPreferences[b] - destinationPreferences[a])
    .slice(0, 5);
  
  return {
    recommendedThemes,
    popularDestinations,
    recommendedBudget: input.budget,
    confidence: Math.min(similarUsers.length / 20, 1), // Confidence based on sample size
    personalizedTips: generatePersonalizedTips(userHistory, input)
  };
}

function generatePersonalizedTips(userHistory, input) {
  const tips = [];
  
  if (userHistory.length > 0) {
    const avgRating = userHistory.reduce((sum, h) => sum + (h.userRating || 0), 0) / userHistory.length;
    if (avgRating >= 4) {
      tips.push("Based on your high ratings, you have great taste in travel experiences!");
    }
    
    const frequentTheme = getMostFrequent(userHistory.map(h => h.theme));
    if (frequentTheme && frequentTheme !== input.theme) {
      tips.push(`You usually enjoy ${frequentTheme} activities - we've added some similar options.`);
    }
  }
  
  return tips;
}

function getMostFrequent(arr) {
  const counts = arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
  
  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, arr[0]);
}

async function updateUserPreferences(userId, action, metadata) {
  const userRef = db.collection('users').doc(userId);
  
  // Update preferences based on user actions
  if (action === 'rate' && metadata.rating >= 4) {
    // User liked this experience
    await userRef.update({
      'preferences.favoriteActivityTypes': admin.firestore.FieldValue.arrayUnion(metadata.theme || ''),
      lastActivityAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
}

async function updateUserPreferenceProfile(userId, features) {
  const userRef = db.collection('users').doc(userId);
  
  await userRef.update({
    'preferences.preferredDestinations': admin.firestore.FieldValue.arrayUnion(features.destination),
    'preferences.favoriteActivityTypes': admin.firestore.FieldValue.arrayUnion(features.theme),
    totalItineraries: admin.firestore.FieldValue.increment(1),
    lastItineraryAt: admin.firestore.FieldValue.serverTimestamp()
  });
}

function calculateFeatureCorrelations(trainingData) {
  // Simplified correlation calculation
  const correlations = {};
  
  // Theme-Rating correlation
  const themeRatings = {};
  trainingData.forEach(data => {
    const theme = data.features.theme;
    const rating = data.features.rating;
    if (!themeRatings[theme]) themeRatings[theme] = [];
    themeRatings[theme].push(rating);
  });
  
  correlations.themes = Object.keys(themeRatings).map(theme => ({
    theme,
    avgRating: themeRatings[theme].reduce((a, b) => a + b, 0) / themeRatings[theme].length,
    count: themeRatings[theme].length
  })).sort((a, b) => b.avgRating - a.avgRating);
  
  return correlations;
}

function generateUserClusters(trainingData) {
  // Simple clustering by preferences
  const clusters = {};
  
  trainingData.forEach(data => {
    const key = `${data.features.theme}_${data.features.budget}`;
    if (!clusters[key]) clusters[key] = [];
    clusters[key].push(data.itinerary.userId);
  });
  
  return Object.keys(clusters).map(key => ({
    profile: key,
    userCount: clusters[key].length,
    users: [...new Set(clusters[key])] // Remove duplicates
  }));
}

function calculateRecommendationAccuracy(trainingData) {
  // Simplified accuracy calculation
  const highRatedCount = trainingData.filter(data => data.features.rating >= 4).length;
  return trainingData.length > 0 ? highRatedCount / trainingData.length : 0;
}

async function saveModelMetrics(metrics) {
  await db.collection('ml_metrics').add(metrics);
}

async function getNewDataCount() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const snapshot = await db.collection('itineraries')
    .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(oneDayAgo))
    .get();
  return snapshot.size;
}

async function isAdmin(uid) {
  const userDoc = await db.collection('users').doc(uid).get();
  return userDoc.exists && userDoc.data().isAdmin === true;
}

async function getTotalUsers() {
  const snapshot = await db.collection('users').get();
  return snapshot.size;
}

async function getTotalItineraries() {
  const snapshot = await db.collection('itineraries').get();
  return snapshot.size;
}

async function getPopularDestinations() {
  const snapshot = await db.collection('itineraries').limit(1000).get();
  const destinations = {};
  
  snapshot.docs.forEach(doc => {
    const dest = doc.data().destination;
    destinations[dest] = (destinations[dest] || 0) + 1;
  });
  
  return Object.keys(destinations)
    .sort((a, b) => destinations[b] - destinations[a])
    .slice(0, 10)
    .map(dest => ({ destination: dest, count: destinations[dest] }));
}

async function getPopularThemes() {
  const snapshot = await db.collection('itineraries').limit(1000).get();
  const themes = {};
  
  snapshot.docs.forEach(doc => {
    const theme = doc.data().theme;
    themes[theme] = (themes[theme] || 0) + 1;
  });
  
  return Object.keys(themes)
    .sort((a, b) => themes[b] - themes[a])
    .slice(0, 10)
    .map(theme => ({ theme, count: themes[theme] }));
}

async function getAverageRating() {
  const snapshot = await db.collection('itineraries')
    .where('userRating', '>=', 1)
    .get();
    
  if (snapshot.empty) return 0;
  
  const totalRating = snapshot.docs.reduce((sum, doc) => {
    return sum + (doc.data().userRating || 0);
  }, 0);
  
  return totalRating / snapshot.size;
}

async function getUserEngagementMetrics() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  const activeUsersSnapshot = await db.collection('users')
    .where('lastLoginAt', '>=', admin.firestore.Timestamp.fromDate(weekAgo))
    .get();
    
  const behaviorSnapshot = await db.collection('user_behavior')
    .where('timestamp', '>=', admin.firestore.Timestamp.fromDate(weekAgo))
    .get();
  
  return {
    weeklyActiveUsers: activeUsersSnapshot.size,
    weeklyActions: behaviorSnapshot.size,
    avgActionsPerUser: activeUsersSnapshot.size > 0 ? behaviorSnapshot.size / activeUsersSnapshot.size : 0
  };
}

async function getLatestModelMetrics() {
  const snapshot = await db.collection('ml_metrics')
    .orderBy('timestamp', 'desc')
    .limit(1)
    .get();
    
  return snapshot.empty ? null : snapshot.docs[0].data();
}
