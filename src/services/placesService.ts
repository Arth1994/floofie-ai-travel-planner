export interface Place {
  name: string;
  type: string;
  rating: number;
  price: string;
  address: string;
  mapsUrl: string;
  bookingUrl: string;
}

export interface Restaurant {
  name: string;
  type: string;
  rating: number;
  price: string;
  address: string;
  mapsUrl: string;
  bookingUrl: string;
  reviews: number;
  dietary: string;
}

export interface PlacesData {
  [destination: string]: {
    [theme: string]: Place[];
  };
}

export interface RestaurantsData {
  [destination: string]: Restaurant[];
}

/**
 * Dynamic Places Service - Generates realistic places for any destination
 * This replaces the hardcoded Cancun-only data
 */
export class PlacesService {
  private static instance: PlacesService;
  
  private constructor() {}
  
  static getInstance(): PlacesService {
    if (!PlacesService.instance) {
      PlacesService.instance = new PlacesService();
    }
    return PlacesService.instance;
  }

  /**
   * Generate places for any destination and theme
   */
  async searchPlaces(query: string, destination: string): Promise<Place[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return this.generatePlacesForDestination(destination, query);
  }

  /**
   * Generate restaurants for any destination
   */
  async searchRestaurants(destination: string, dietary: string = 'Any'): Promise<Restaurant[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return this.generateRestaurantsForDestination(destination, dietary);
  }

  private generatePlacesForDestination(destination: string, theme: string): Place[] {
    const baseUrl = `https://maps.google.com/?q=${encodeURIComponent(destination)}`;
    const bookingUrl = `https://www.tripadvisor.com/Attraction_Review-${destination.toLowerCase().replace(/\s+/g, '')}`;
    
    // Generate theme-specific places for any destination
    switch (theme.toLowerCase()) {
      case 'cultural':
        return [
          {
            name: `${destination} Museum of Art`,
            type: 'Museum',
            rating: 4.5,
            price: '$12',
            address: `123 Cultural District, ${destination}`,
            mapsUrl: `${baseUrl}+Museum+of+Art`,
            bookingUrl: bookingUrl
          },
          {
            name: `Historic ${destination} Center`,
            type: 'Historic Site',
            rating: 4.3,
            price: 'Free',
            address: `Old Town, ${destination}`,
            mapsUrl: `${baseUrl}+Historic+Center`,
            bookingUrl: bookingUrl
          },
          {
            name: `${destination} Cultural Center`,
            type: 'Cultural Center',
            rating: 4.4,
            price: '$8',
            address: `456 Arts Quarter, ${destination}`,
            mapsUrl: `${baseUrl}+Cultural+Center`,
            bookingUrl: bookingUrl
          }
        ];
      
      case 'adventure':
        return [
          {
            name: `${destination} Adventure Park`,
            type: 'Adventure Park',
            rating: 4.7,
            price: '$45',
            address: `789 Adventure Way, ${destination}`,
            mapsUrl: `${baseUrl}+Adventure+Park`,
            bookingUrl: bookingUrl
          },
          {
            name: `${destination} Hiking Trails`,
            type: 'Hiking',
            rating: 4.6,
            price: 'Free',
            address: `${destination} National Park`,
            mapsUrl: `${baseUrl}+Hiking+Trails`,
            bookingUrl: bookingUrl
          },
          {
            name: `${destination} Water Sports`,
            type: 'Water Sports',
            rating: 4.5,
            price: '$35',
            address: `${destination} Marina`,
            mapsUrl: `${baseUrl}+Water+Sports`,
            bookingUrl: bookingUrl
          }
        ];

      case 'spa & wellness':
        return [
          {
            name: `${destination} Luxury Spa`,
            type: 'Spa & Wellness',
            rating: 4.8,
            price: '$120',
            address: `Spa Resort, ${destination}`,
            mapsUrl: `${baseUrl}+Luxury+Spa`,
            bookingUrl: bookingUrl
          },
          {
            name: `${destination} Wellness Retreat`,
            type: 'Wellness Center',
            rating: 4.6,
            price: '$85',
            address: `Wellness District, ${destination}`,
            mapsUrl: `${baseUrl}+Wellness+Retreat`,
            bookingUrl: bookingUrl
          },
          {
            name: `${destination} Yoga Studio`,
            type: 'Yoga Studio',
            rating: 4.4,
            price: '$25',
            address: `Mindfulness Center, ${destination}`,
            mapsUrl: `${baseUrl}+Yoga+Studio`,
            bookingUrl: bookingUrl
          }
        ];

      default:
        return [
          {
            name: `${destination} City Tour`,
            type: 'City Tour',
            rating: 4.5,
            price: '$30',
            address: `Downtown ${destination}`,
            mapsUrl: `${baseUrl}+City+Tour`,
            bookingUrl: bookingUrl
          },
          {
            name: `${destination} Local Market`,
            type: 'Market',
            rating: 4.2,
            price: 'Free',
            address: `Market Square, ${destination}`,
            mapsUrl: `${baseUrl}+Local+Market`,
            bookingUrl: bookingUrl
          },
          {
            name: `${destination} Scenic Viewpoint`,
            type: 'Scenic View',
            rating: 4.6,
            price: 'Free',
            address: `${destination} Overlook`,
            mapsUrl: `${baseUrl}+Scenic+Viewpoint`,
            bookingUrl: bookingUrl
          }
        ];
    }
  }

  private generateRestaurantsForDestination(destination: string, dietary: string): Restaurant[] {
    const baseUrl = `https://maps.google.com/?q=${encodeURIComponent(destination)}`;
    const bookingUrl = `https://www.opentable.com/${destination.toLowerCase().replace(/\s+/g, '')}`;
    
    const restaurants = [
      {
        name: `${destination} Bistro`,
        type: 'Contemporary',
        rating: 4.5,
        price: '$45',
        address: `123 Main Street, ${destination}`,
        mapsUrl: `${baseUrl}+Bistro`,
        bookingUrl: bookingUrl,
        reviews: 284,
        dietary: 'Any'
      },
      {
        name: `${destination} Garden Restaurant`,
        type: 'Garden Dining',
        rating: 4.3,
        price: '$35',
        address: `456 Garden District, ${destination}`,
        mapsUrl: `${baseUrl}+Garden+Restaurant`,
        bookingUrl: bookingUrl,
        reviews: 192,
        dietary: 'Vegetarian'
      },
      {
        name: `${destination} Seafood House`,
        type: 'Seafood',
        rating: 4.7,
        price: '$55',
        address: `${destination} Harbor`,
        mapsUrl: `${baseUrl}+Seafood+House`,
        bookingUrl: bookingUrl,
        reviews: 367,
        dietary: 'Non-Vegetarian'
      },
      {
        name: `${destination} Vegan Café`,
        type: 'Vegan',
        rating: 4.4,
        price: '$25',
        address: `789 Health District, ${destination}`,
        mapsUrl: `${baseUrl}+Vegan+Café`,
        bookingUrl: bookingUrl,
        reviews: 156,
        dietary: 'Vegan'
      },
      {
        name: `${destination} Fine Dining`,
        type: 'Fine Dining',
        rating: 4.8,
        price: '$85',
        address: `Upscale District, ${destination}`,
        mapsUrl: `${baseUrl}+Fine+Dining`,
        bookingUrl: bookingUrl,
        reviews: 423,
        dietary: 'Any'
      },
      {
        name: `${destination} Street Food Market`,
        type: 'Street Food',
        rating: 4.2,
        price: '$15',
        address: `Food Market, ${destination}`,
        mapsUrl: `${baseUrl}+Street+Food+Market`,
        bookingUrl: bookingUrl,
        reviews: 198,
        dietary: 'Any'
      }
    ];

    // Filter by dietary preference
    if (dietary !== 'Any') {
      return restaurants.filter(r => r.dietary === dietary || r.dietary === 'Any');
    }

    return restaurants;
  }
}
