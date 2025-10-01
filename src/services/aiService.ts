// Interface for UI compatibility
export interface ItineraryActivity {
  name: string;
  type: string;
  time: string;
  cost: string;
  rating: number;
  address: string;
  mapsUrl: string;
  bookingUrl: string;
  description: string;
  reviews?: number;
  dietary?: string;
}

// Separate interface for dining items
export interface DiningActivity {
  name: string;
  type: string;
  rating: number;
  reviews: number;
  dietary: string;
  price: string;
  mapsUrl: string;
  bookingUrl: string;
}

// Separate interface for accommodation
export interface AccommodationActivity {
  name: string;
  type: string;
  rating: number;
  price: string;
  mapsUrl: string;
  bookingUrl: string;
}

export interface ItineraryDay {
  day: number;
  morning: ItineraryActivity;
  afternoon: ItineraryActivity;
  evening: ItineraryActivity;
  dining: {
    breakfast: DiningActivity;
    lunch: DiningActivity;
    dinner: DiningActivity;
  };
  accommodation: AccommodationActivity;
}

export interface Itinerary {
  destination: string;
  duration: number;
  budget: string;
  theme: string;
  dietary: string;
  days: ItineraryDay[];
  totalCost: string;
  summary: string;
}

// Internal simple interface for AI responses
interface SimpleItineraryDay {
  day: string;
  brunch: string;
  activity: string;
  dinner: string;
}

interface SimpleItinerary {
  destination: string;
  duration: number;
  theme: string;
  cuisine: string;
  days: SimpleItineraryDay[];
}

// Firebase Cloud Function URL - should be set via environment variable
const GEMINI_API_URL = process.env.NEXT_PUBLIC_GEMINI_API_URL || 'https://us-central1-your-project-id.cloudfunctions.net/geminiProxy';

// System prompt (enhanced for accuracy and reduced hallucinations)
const SYSTEM_PROMPT = `You are Floofie, a cute and loving panda travel companion. Create a detailed, realistic travel itinerary using ONLY real, well-known restaurants and attractions.

CRITICAL REQUIREMENTS:
1. Use ONLY real restaurant names that exist in the destination city
2. Use ONLY real attractions and activities that actually exist
3. Include realistic pricing estimates based on the destination
4. Mention specific addresses or neighborhoods when possible
5. Be specific about reservation requirements for restaurants

Your response MUST be valid JSON that strictly conforms to this schema:
{
  "destination": "string (the exact destination provided)",
  "duration": number,
  "theme": "string (the theme provided)",
  "cuisine": "string (the dietary preference provided)",
  "days": [
    {
      "day": "Day X: [Descriptive title]",
      "brunch": "Real restaurant name with specific details and realistic pricing",
      "activity": "Real attraction/activity with specific location and details",
      "dinner": "Real restaurant name with reservation details and pricing"
    }
  ]
}

EXAMPLES of good responses:
- "**Café Maya** in downtown Cancun - Fresh fruit platters and chilaquiles ($15-25). Located in Plaza Maya."
- "Visit **Chichen Itza** archaeological site - World Wonder Maya ruins with guided tours ($60 entrance + $40 guide)"
- "**Lorenzo's at Nizuc Resort** - Italian fine dining with ocean views ($80-120 per person). Reservations required."

Do NOT invent restaurant names. Use established, real businesses only.`;

export class AIService {
  private static instance: AIService;

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generateItinerary(
    destination: string,
    duration: number,
    budget: string,
    theme: string,
    dietary: string,
    places: any[],
    restaurants: any[]
  ): Promise<Itinerary> {
    try {
      // Use the exact same approach as the working React app
      const userPrompt = `${SYSTEM_PROMPT}\n\nPlan a ${duration}-day trip to ${destination} with a focus on ${theme} and ${dietary} cuisine. Make it cute and panda-themed! 🐼`;
      
      const body = {
        contents: [
          { parts: [{ text: userPrompt }] }
        ]
      };

      // Call Firebase Cloud Function (same as working React app)
      const res = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      // Extract text from response (same logic as working React app)
      let text = '';
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        text = data.candidates[0].content.parts[0].text;
      } else if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.inlineData?.data) {
        text = atob(data.candidates[0].content.parts[0].inlineData.data);
      }

      // Clean up the text and find JSON (handle markdown code blocks)
      let cleanText = text;
      
      // Remove markdown code blocks if present
      cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Find the first JSON object in the text (same as working React app)
      const match = cleanText.match(/\{[\s\S]*\}/);
      if (!match) {
        console.error('Raw text from AI:', text);
        throw new Error('No valid JSON found in LLM response.');
      }

      let parsed;
      try {
        parsed = JSON.parse(match[0]);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Attempted to parse:', match[0]);
        throw new Error('Failed to parse JSON from AI response');
      }
      
      // Convert simple format to complex format for UI compatibility
      return this.convertToComplexFormat(parsed, budget, dietary);
    } catch (error) {
      console.error('AI Service Error:', error);
      // Fallback to a simple itinerary structure
      return this.generateFallbackItinerary(destination, duration, theme, dietary);
    }
  }

  private convertToComplexFormat(simple: SimpleItinerary, budget: string, dietary: string): Itinerary {
    return {
      destination: simple.destination,
      duration: simple.duration,
      budget: budget,
      theme: simple.theme,
      dietary: dietary,
      totalCost: this.calculateTotalCost(budget, simple.duration),
      summary: `Your ${simple.duration}-day ${simple.theme} adventure to ${simple.destination}! Created with love by Floofie the panda 🐼`,
      days: simple.days.map((simpleDay, index) => ({
        day: index + 1,
        morning: this.parseActivityFromText(simpleDay.brunch, 'Morning', '9:00 AM', dietary),
        afternoon: this.parseActivityFromText(simpleDay.activity, 'Activity', '2:00 PM', dietary),
        evening: this.parseActivityFromText(simpleDay.dinner, 'Evening', '7:00 PM', dietary),
        dining: {
          breakfast: this.parseDiningFromText(simpleDay.brunch, 'Breakfast', dietary),
          lunch: this.parseDiningFromText(simpleDay.activity, 'Lunch', dietary),
          dinner: this.parseDiningFromText(simpleDay.dinner, 'Dinner', dietary)
        },
        accommodation: this.generateAccommodationActivity(simple.destination, index + 1)
      }))
    };
  }

  private parseActivityFromText(text: string, type: string, time: string, dietary: string = 'Any'): ItineraryActivity {
    // Extract the first part as the name (up to first sentence or dash)
    let name = text.split('.')[0].split(' - ')[0];
    
    // Clean up the name - remove markdown and unwanted prefixes
    name = name.replace(/\*\*/g, ''); // Remove markdown asterisks
    name = name.replace(/^(After|Time|For|Let's|Good morning|Today).*?at\s+/i, '');
    name = name.trim().substring(0, 60) || `${type} Activity`;
    
    return {
      name: name,
      type: type,
      time: time,
      cost: this.extractCostFromText(text),
      rating: Math.round((4.5 + Math.random() * 0.5) * 10) / 10, // Round to 1 decimal
      address: 'City Center',
      mapsUrl: 'https://maps.google.com',
      bookingUrl: 'https://booking.com',
      description: text,
      reviews: Math.floor(Math.random() * 500) + 50,
      dietary: dietary
    };
  }

  private parseDiningFromText(text: string, mealType: string, dietary: string): DiningActivity {
    // Extract restaurant name from text (look for ** markers or first sentence)
    let name = text.match(/\*\*(.*?)\*\*/)?.[1] || text.split('.')[0];
    
    // Clean up the name - remove markdown and unwanted prefixes
    name = name.replace(/\*\*/g, ''); // Remove markdown asterisks
    name = name.replace(/^(After|Time|For|Let's|Good morning|Today).*?at\s+/i, '');
    name = name.trim().substring(0, 50) || `${mealType} Restaurant`;
    
    return {
      name: name,
      type: `${mealType} Restaurant`,
      rating: Math.round((4.0 + Math.random() * 1.0) * 10) / 10, // Round to 1 decimal
      reviews: Math.floor(Math.random() * 800) + 100,
      dietary: dietary,
      price: this.extractCostFromText(text),
      mapsUrl: 'https://maps.google.com',
      bookingUrl: 'https://booking.com'
    };
  }

  private generateAccommodationActivity(destination: string, dayNumber: number): AccommodationActivity {
    const hotelTypes = ['Luxury Resort', 'Boutique Hotel', 'City Hotel', 'Beach Resort', 'Mountain Lodge'];
    const type = hotelTypes[Math.floor(Math.random() * hotelTypes.length)];
    
    return {
      name: `${destination} ${type}`,
      type: type,
      rating: Math.round((4.2 + Math.random() * 0.8) * 10) / 10, // Round to 1 decimal
      price: `$${Math.floor(Math.random() * 300) + 150}/night`,
      mapsUrl: 'https://maps.google.com',
      bookingUrl: 'https://booking.com'
    };
  }

  private extractCostFromText(text: string): string {
    // Try to extract cost from text, fallback to default
    const costMatch = text.match(/\$\d+(-\d+)?/);
    if (costMatch) {
      return costMatch[0];
    }
    return '$50';
  }

  private calculateTotalCost(budget: string, duration: number): string {
    const budgetRanges = {
      'Under $500': { min: 300, max: 500 },
      '$500-$1000': { min: 500, max: 1000 },
      '$1000-$2000': { min: 1000, max: 2000 },
      '$2000+': { min: 2000, max: 5000 }
    };

    const range = budgetRanges[budget as keyof typeof budgetRanges] || { min: 500, max: 1000 };
    const baseCost = range.min + Math.random() * (range.max - range.min);
    const totalCost = baseCost * (duration / 3);

    return `$${Math.round(totalCost)}`;
  }


  private generateFallbackItinerary(
    destination: string,
    duration: number,
    theme: string,
    dietary: string
  ): Itinerary {
    // Generate fallback in complex format for UI compatibility
    const days: ItineraryDay[] = [];
    
    for (let i = 1; i <= duration; i++) {
      days.push({
        day: i,
        morning: this.parseActivityFromText(
          `Local ${dietary} restaurant in ${destination} - Perfect for brunch! 🎋`,
          'Morning',
          '9:00 AM',
          dietary
        ),
        afternoon: this.parseActivityFromText(
          `${theme} activity in ${destination} - Explore the local ${theme.toLowerCase()} scene! 🐾`,
          'Activity',
          '2:00 PM',
          dietary
        ),
        evening: this.parseActivityFromText(
          `Premium ${dietary} dining experience in ${destination} - Make a reservation! 🎋`,
          'Evening',
          '7:00 PM',
          dietary
        ),
        dining: {
          breakfast: this.parseDiningFromText(
            `Local ${dietary} café in ${destination} - Perfect for breakfast! 🎋`,
            'Breakfast',
            dietary
          ),
          lunch: this.parseDiningFromText(
            `Popular ${dietary} restaurant in ${destination} - Great lunch spot! 🎋`,
            'Lunch',
            dietary
          ),
          dinner: this.parseDiningFromText(
            `Premium ${dietary} dining experience in ${destination} - Make a reservation! 🎋`,
            'Dinner',
            dietary
          )
        },
        accommodation: this.generateAccommodationActivity(destination, i)
      });
    }

    return {
      destination,
      duration,
      budget: '$500-$1000',
      theme,
      dietary,
      totalCost: this.calculateTotalCost('$500-$1000', duration),
      summary: `Your ${duration}-day ${theme} adventure to ${destination}! Created with love by Floofie the panda 🐼`,
      days
    };
  }
}

// Export the main function for direct use
export async function generateItineraryWithAI(
  destination: string,
  duration: number,
  budget: string,
  theme: string,
  dietary: string,
  places: any[] = [],
  restaurants: any[] = []
): Promise<Itinerary> {
  const aiService = AIService.getInstance();
  return aiService.generateItinerary(destination, duration, budget, theme, dietary, places, restaurants);
}