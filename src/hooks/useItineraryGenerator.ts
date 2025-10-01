import { useState, useCallback } from 'react';
import { generateItineraryWithAI } from '../services/aiService';
import { validateTravelFormData, type TravelFormData } from '../lib/validation';
import { useRateLimit } from '../lib/rateLimiter';

export interface UseItineraryGeneratorReturn {
  generateItinerary: (formData: TravelFormData) => Promise<void>;
  isLoading: boolean;
  result: any;
  errors: string[];
  securityMessage: string;
  setErrors: (errors: string[]) => void;
  setSecurityMessage: (message: string) => void;
}

/**
 * Custom hook for itinerary generation following Clean Architecture principles
 */
export const useItineraryGenerator = (): UseItineraryGeneratorReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [securityMessage, setSecurityMessage] = useState<string>('');

  const { checkLimit } = useRateLimit();

  const generateItinerary = useCallback(async (formData: TravelFormData) => {
    try {
      setIsLoading(true);
      setErrors([]);
      setSecurityMessage('');

      // Validate input
      const validation = validateTravelFormData(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      // Check rate limiting
      const rateLimitResult = checkLimit();
      if (!rateLimitResult.allowed) {
        setErrors(['Too many requests. Please wait before trying again.']);
        return;
      }

      const sanitizedData = validation.sanitizedData!;

      // Generate itinerary using AI service
      const itinerary = await generateItineraryWithAI(
        sanitizedData.destination,
        sanitizedData.duration,
        sanitizedData.budget,
        sanitizedData.theme,
        sanitizedData.dietary || 'Any'
      );

      setResult(itinerary);
      const remaining = rateLimitResult.remaining || 0;
      setSecurityMessage(`✅ Itinerary generated successfully! You have ${remaining} more requests available this minute.`);

    } catch (error) {
      console.error('Error generating itinerary:', error);
      setErrors(['Failed to generate itinerary. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  }, [checkLimit]);

  return {
    generateItinerary,
    isLoading,
    result,
    errors,
    securityMessage,
    setErrors,
    setSecurityMessage
  };
};
