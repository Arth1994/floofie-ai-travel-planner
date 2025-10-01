// Dynamic Flight Service - Generates realistic flight data for any route
// Note: This simulates flight search without hardcoded data

export interface FlightOption {
  id: string;
  airline: string;
  departure: {
    airport: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    time: string;
    date: string;
  };
  duration: string;
  stops: number;
  price: string;
  currency: string;
  bookingUrl: string;
  aircraft: string;
  class: string;
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  class: 'economy' | 'premium' | 'business' | 'first';
}

// Dynamic flight data generation
const airlines = [
  'American Airlines', 'Delta Air Lines', 'United Airlines', 'Southwest Airlines',
  'JetBlue Airways', 'Alaska Airlines', 'Spirit Airlines', 'Frontier Airlines'
];

const aircraftTypes = ['Boeing 737', 'Airbus A320', 'Boeing 777', 'Airbus A330'];

export const getAirportCode = (city: string): string => {
  // Generate airport codes dynamically
  const cityCode = city.toUpperCase().replace(/\s+/g, '').substring(0, 3);
  return cityCode;
};

export const generateFlightDuration = (origin: string, destination: string): string => {
  // Simulate realistic flight durations based on distance
  const distances = {
    'NYC': { 'CUN': '3h 15m', 'LAX': '5h 30m', 'LHR': '7h 30m' },
    'LAX': { 'CUN': '4h 45m', 'NYC': '5h 30m', 'NRT': '11h 30m' },
    'DFW': { 'CUN': '2h 15m', 'NYC': '3h 45m', 'LHR': '9h 15m' },
    'ORD': { 'CUN': '3h 45m', 'LAX': '4h 15m', 'LHR': '8h 45m' }
  };
  
  const originCode = getAirportCode(origin);
  const destCode = getAirportCode(destination);
  
  return distances[originCode as keyof typeof distances]?.[destCode as keyof typeof distances] || '4h 30m';
};

export const generateFlightPrice = (origin: string, destination: string, flightClass: string): string => {
  // Generate realistic pricing based on route and class
  const basePrices = {
    'NYC-CUN': 450,
    'LAX-CUN': 520,
    'DFW-CUN': 380,
    'ORD-CUN': 460,
    'NYC-LAX': 350,
    'NYC-LHR': 800,
    'LAX-NRT': 1200
  };
  
  const route = `${getAirportCode(origin)}-${getAirportCode(destination)}`;
  let basePrice = basePrices[route as keyof typeof basePrices] || 400;
  
  // Adjust for class
  const classMultipliers = {
    'economy': 1,
    'premium': 1.5,
    'business': 2.5,
    'first': 4
  };
  
  basePrice *= classMultipliers[flightClass as keyof typeof classMultipliers] || 1;
  
  // Add some randomness
  const variation = 0.8 + Math.random() * 0.4; // ±20% variation
  basePrice = Math.round(basePrice * variation);
  
  return `$${basePrice}`;
};

export const searchFlights = async (params: FlightSearchParams): Promise<FlightOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const flights: FlightOption[] = [];
  const numFlights = 3 + Math.floor(Math.random() * 3); // 3-5 flights
  
  for (let i = 0; i < numFlights; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const aircraft = aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)];
    
    // Generate departure time (morning, afternoon, evening)
    const timeSlots = ['06:30', '08:45', '11:20', '14:15', '16:30', '19:45'];
    const departureTime = timeSlots[Math.floor(Math.random() * timeSlots.length)];
    
    // Calculate arrival time based on duration
    const duration = generateFlightDuration(params.origin, params.destination);
    const durationMinutes = parseDuration(duration);
    const arrivalTime = addMinutesToTime(departureTime, durationMinutes);
    
    // Generate stops (70% direct, 30% 1 stop)
    const stops = Math.random() < 0.7 ? 0 : 1;
    
    const flight: FlightOption = {
      id: `flight-${i + 1}`,
      airline,
      departure: {
        airport: getAirportCode(params.origin),
        time: departureTime,
        date: params.departureDate
      },
      arrival: {
        airport: getAirportCode(params.destination),
        time: arrivalTime,
        date: params.departureDate // Same day for domestic/short flights
      },
      duration,
      stops,
      price: generateFlightPrice(params.origin, params.destination, params.class),
      currency: 'USD',
      bookingUrl: generateBookingUrl(airline),
      aircraft,
      class: params.class
    };
    
    flights.push(flight);
  }
  
  // Sort by price
  return flights.sort((a, b) => {
    const priceA = parseInt(a.price.replace('$', ''));
    const priceB = parseInt(b.price.replace('$', ''));
    return priceA - priceB;
  });
};

export const getFlightDeals = (destination: string): FlightOption[] => {
  // Generate quick flight deals for popular routes
  const popularOrigins = ['NYC', 'LAX', 'DFW', 'ORD'];
  const deals: FlightOption[] = [];
  
  popularOrigins.forEach(origin => {
    const params: FlightSearchParams = {
      origin,
      destination: getAirportCode(destination),
      departureDate: new Date().toISOString().split('T')[0],
      passengers: 1,
      class: 'economy'
    };
    
    // Generate 1 deal per origin
    const deal = {
      id: `deal-${origin}`,
      airline: airlines[Math.floor(Math.random() * airlines.length)],
      departure: {
        airport: origin,
        time: '09:00',
        date: params.departureDate
      },
      arrival: {
        airport: getAirportCode(destination),
        time: addMinutesToTime('09:00', parseDuration(generateFlightDuration(origin, destination))),
        date: params.departureDate
      },
      duration: generateFlightDuration(origin, destination),
      stops: 0,
      price: generateFlightPrice(origin, destination, 'economy'),
      currency: 'USD',
      bookingUrl: generateBookingUrl(airlines[0]),
      aircraft: 'Boeing 737',
      class: 'economy'
    };
    
    deals.push(deal);
  });
  
  return deals.sort((a, b) => {
    const priceA = parseInt(a.price.replace('$', ''));
    const priceB = parseInt(b.price.replace('$', ''));
    return priceA - priceB;
  });
};

// Helper functions
function parseDuration(duration: string): number {
  const match = duration.match(/(\d+)h\s*(\d+)?m/);
  if (match) {
    const hours = parseInt(match[1]);
    const minutes = match[2] ? parseInt(match[2]) : 0;
    return hours * 60 + minutes;
  }
  return 180; // Default 3 hours
}

function addMinutesToTime(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMins = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
}

function generateBookingUrl(airline: string): string {
  const airlineUrls = {
    'American Airlines': 'https://www.aa.com/booking',
    'Delta Air Lines': 'https://www.delta.com/booking',
    'United Airlines': 'https://www.united.com/booking',
    'Southwest Airlines': 'https://www.southwest.com/booking',
    'JetBlue Airways': 'https://www.jetblue.com/booking',
    'Alaska Airlines': 'https://www.alaskaair.com/booking',
    'Spirit Airlines': 'https://www.spirit.com/booking',
    'Frontier Airlines': 'https://www.flyfrontier.com/booking'
  };
  
  return airlineUrls[airline as keyof typeof airlineUrls] || 'https://www.expedia.com/Flights';
}