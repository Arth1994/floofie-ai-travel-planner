/**
 * Itinerary Save/Load Component
 * Handles saving itineraries to Firebase and loading user's saved itineraries
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  saveItinerary, 
  getUserItineraries, 
  updateItineraryFeedback,
  trackUserBehavior,
  ItineraryData 
} from '../lib/firebase';
import { type TravelFormData } from '../lib/validation';

interface ItinerarySaveLoadProps {
  user: User | null;
  currentItinerary: any;
  formData: TravelFormData;
  onLoadItinerary: (itinerary: any, formData: TravelFormData) => void;
}

export const ItinerarySaveLoad: React.FC<ItinerarySaveLoadProps> = ({
  user,
  currentItinerary,
  formData,
  onLoadItinerary
}) => {
  const [savedItineraries, setSavedItineraries] = useState<ItineraryData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentItineraryId, setCurrentItineraryId] = useState<string | null>(null);

  // Load user's saved itineraries on component mount
  useEffect(() => {
    if (user) {
      loadUserItineraries();
    }
  }, [user]);

  const loadUserItineraries = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const itineraries = await getUserItineraries(user.uid, 10);
      setSavedItineraries(itineraries);
    } catch (error) {
      console.error('Error loading itineraries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveItinerary = async () => {
    if (!user || !currentItinerary) return;
    
    setSaveStatus('saving');
    try {
      const itineraryId = await saveItinerary(user.uid, currentItinerary, formData);
      setCurrentItineraryId(itineraryId);
      setSaveStatus('saved');
      
      // Track save behavior
      await trackUserBehavior(
        user.uid,
        `session_${Date.now()}`,
        'save',
        'itinerary',
        itineraryId,
        { destination: formData.destination, theme: formData.theme }
      );
      
      // Reload saved itineraries
      await loadUserItineraries();
      
      // Show rating modal after successful save
      setTimeout(() => {
        setShowRatingModal(true);
      }, 1000);
      
    } catch (error) {
      console.error('Error saving itinerary:', error);
      setSaveStatus('error');
    }
  };

  const handleLoadItinerary = async (itinerary: ItineraryData) => {
    if (!user) return;
    
    // Track load behavior
    await trackUserBehavior(
      user.uid,
      `session_${Date.now()}`,
      'view',
      'itinerary',
      itinerary.id || 'unknown',
      { destination: itinerary.destination }
    );
    
    // Load the itinerary data
    const loadFormData: TravelFormData = {
      destination: itinerary.destination,
      duration: itinerary.duration,
      budget: itinerary.budget,
      theme: itinerary.theme,
      dietary: itinerary.dietary
    };
    
    onLoadItinerary(itinerary.itinerary, loadFormData);
  };

  const handleRatingSubmit = async () => {
    if (!user || !currentItineraryId) return;
    
    try {
      await updateItineraryFeedback(currentItineraryId, user.uid, selectedRating, feedback);
      setShowRatingModal(false);
      setFeedback('');
      setSelectedRating(5);
      
      // Reload itineraries to show updated rating
      await loadUserItineraries();
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getRatingStars = (rating: number): string => {
    return '⭐'.repeat(Math.round(rating));
  };

  if (!user) {
    return (
      <div className="bg-slate-100 rounded-xl p-6 text-center">
        <p className="text-slate-600 mb-2">🔒 Sign in to save and access your itineraries</p>
        <p className="text-sm text-slate-500">
          Build your personal travel collection and help Floofie learn your preferences! 🐼
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Save Current Itinerary */}
      {currentItinerary && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            💾 Save This Itinerary
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Save your personalized {formData.destination} itinerary and help Floofie learn your preferences!
          </p>
          
          <button
            onClick={handleSaveItinerary}
            disabled={saveStatus === 'saving'}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              saveStatus === 'saving'
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : saveStatus === 'saved'
                ? 'bg-green-500 text-white'
                : saveStatus === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md hover:shadow-lg'
            }`}
          >
            {saveStatus === 'saving' && '💾 Saving...'}
            {saveStatus === 'saved' && '✅ Saved!'}
            {saveStatus === 'error' && '❌ Error'}
            {saveStatus === 'idle' && '💾 Save Itinerary'}
          </button>
        </div>
      )}

      {/* Saved Itineraries */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            📚 Your Saved Itineraries
          </h3>
          <button
            onClick={loadUserItineraries}
            disabled={isLoading}
            className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors"
          >
            {isLoading ? '↻ Loading...' : '🔄 Refresh'}
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin text-2xl mb-2">🐾</div>
            <p className="text-slate-500">Loading your travel memories...</p>
          </div>
        ) : savedItineraries.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p className="text-lg mb-2">📝 No saved itineraries yet</p>
            <p className="text-sm">Create and save your first itinerary to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedItineraries.map((itinerary) => (
              <div
                key={itinerary.id}
                className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer"
                onClick={() => handleLoadItinerary(itinerary)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-800">{itinerary.destination}</h4>
                  {itinerary.userRating && (
                    <span className="text-sm bg-amber-100 text-amber-700 px-2 py-1 rounded">
                      {getRatingStars(itinerary.userRating)}
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-slate-600 space-y-1">
                  <p>🎯 {itinerary.theme}</p>
                  <p>📅 {itinerary.duration} days</p>
                  <p>💰 {itinerary.budget}</p>
                  <p>🍽️ {itinerary.dietary}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    Saved {formatDate(itinerary.createdAt)}
                  </p>
                </div>
                
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <button className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded hover:bg-emerald-200 transition-colors">
                    📖 Load Itinerary
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              🌟 Rate Your Itinerary
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Help Floofie learn your preferences by rating this itinerary!
            </p>
            
            {/* Star Rating */}
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setSelectedRating(star)}
                  className={`text-2xl transition-all duration-200 hover:scale-110 ${
                    star <= selectedRating ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-300'
                  }`}
                >
                  {star <= selectedRating ? '⭐' : '☆'}
                </button>
              ))}
              <span className="text-sm text-slate-600 ml-2 font-medium">
                ({selectedRating}/5)
              </span>
            </div>
            
            {/* Feedback */}
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what you loved or what could be improved... (optional)"
              className="w-full p-3 border border-slate-300 rounded-lg text-sm mb-4 resize-none"
              rows={3}
            />
            
            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleRatingSubmit}
                className="flex-1 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors font-semibold"
              >
                ✨ Submit Rating
              </button>
              <button
                onClick={() => setShowRatingModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
