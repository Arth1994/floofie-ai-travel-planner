/**
 * Input validation and sanitization utilities
 * Protects against injection attacks and malformed data
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedData?: any;
}

export interface TravelFormData {
  destination: string;
  duration: number;
  theme: string;
  budget: number;
  dietary?: string;
}

export function validateTravelFormData(data: any): ValidationResult {
  const errors: string[] = [];

  // Validate destination
  if (!data.destination || typeof data.destination !== 'string') {
    errors.push('Destination is required and must be a string');
  } else if (data.destination.length < 2 || data.destination.length > 100) {
    errors.push('Destination must be between 2 and 100 characters');
  } else if (!/^[a-zA-Z\s\-'.,]+$/.test(data.destination)) {
    errors.push('Destination contains invalid characters');
  }

  // Validate duration
  if (!data.duration || typeof data.duration !== 'number') {
    errors.push('Duration is required and must be a number');
  } else if (data.duration < 1 || data.duration > 30) {
    errors.push('Duration must be between 1 and 30 days');
  }

  // Validate theme - Updated to match new activity type categories
  const validThemes = [
    // Leisure & Wellness
    'Spa & Wellness', 'Beach Relaxation', 'Yoga Retreat', 'Meditation',
    // Adventure & Sports
    'Water Sports', 'Hiking & Trekking', 'Extreme Sports', 'Cycling Tours',
    // Cultural & Arts
    'Museums & Galleries', 'Historical Sites', 'Local Traditions', 'Art Workshops',
    // Food & Dining
    'Culinary Tours', 'Wine Tasting', 'Street Food', 'Cooking Classes',
    // Nature & Wildlife
    'Wildlife Safari', 'Botanical Gardens', 'National Parks', 'Bird Watching',
    // Urban & Modern
    'City Exploration', 'Shopping Districts', 'Nightlife', 'Tech & Innovation'
  ];
  if (!data.theme || typeof data.theme !== 'string') {
    errors.push('Theme is required and must be a string');
  } else if (!validThemes.includes(data.theme)) {
    errors.push(`Theme must be one of the available activity types`);
  }

  // Validate budget
  if (!data.budget || typeof data.budget !== 'number') {
    errors.push('Budget is required and must be a number');
  } else if (data.budget < 100 || data.budget > 50000) {
    errors.push('Budget must be between $100 and $50,000');
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors
    };
  }

  // Return sanitized data
  return {
    isValid: true,
    errors: [],
    sanitizedData: {
      destination: data.destination.trim(),
      duration: Math.floor(data.duration),
      theme: data.theme.trim(),
      budget: Math.floor(data.budget)
    }
  };
}

export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
