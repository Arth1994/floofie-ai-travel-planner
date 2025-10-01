import React, { useState } from 'react';
import { searchFlights, getFlightDeals, getAirportCode, type FlightOption, type FlightSearchParams } from '../../services/flightsService';

interface FlightSearchProps {
  destination: string;
  departureDate: string;
  returnDate?: string;
}

export const FlightSearch: React.FC<FlightSearchProps> = ({
  destination,
  departureDate,
  returnDate
}) => {
  const [flights, setFlights] = useState<FlightOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({
    origin: 'NYC',
    destination: getAirportCode(destination),
    departureDate,
    returnDate,
    passengers: 1,
    class: 'economy'
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchFlights(searchParams);
      setFlights(results);
    } catch (error) {
      console.error('Flight search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDeals = async () => {
    setLoading(true);
    try {
      const deals = getFlightDeals(destination);
      setFlights(deals);
      setShowSearch(true);
    } catch (error) {
      console.error('Flight deals error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800">✈️ Flight Options</h3>
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={handleQuickDeals}
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Searching...' : '🚀 Quick Flight Deals'}
        </button>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="bg-slate-100 text-slate-700 font-semibold py-3 px-4 rounded-xl hover:bg-slate-200 transition-colors"
        >
          {showSearch ? 'Hide Search' : 'Custom Search'}
        </button>
      </div>

      {showSearch && (
        <div className="bg-slate-50 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">From</label>
              <input
                type="text"
                value={searchParams.origin}
                onChange={(e) => setSearchParams(prev => ({ ...prev, origin: e.target.value }))}
                placeholder="NYC, LAX, etc."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">To</label>
              <input
                type="text"
                value={searchParams.destination}
                onChange={(e) => setSearchParams(prev => ({ ...prev, destination: e.target.value }))}
                placeholder="CUN, MEX, etc."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Departure</label>
              <input
                type="date"
                value={searchParams.departureDate}
                onChange={(e) => setSearchParams(prev => ({ ...prev, departureDate: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Return</label>
              <input
                type="date"
                value={searchParams.returnDate || ''}
                onChange={(e) => setSearchParams(prev => ({ ...prev, returnDate: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Class</label>
              <select
                value={searchParams.class}
                onChange={(e) => setSearchParams(prev => ({ ...prev, class: e.target.value as any }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="economy">Economy</option>
                <option value="premium">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching Flights...' : '🔍 Search Flights'}
          </button>
        </div>
      )}

      {flights.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-slate-800">Available Flights</h4>
          {flights.map((flight) => (
            <div key={flight.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">✈️</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">{flight.airline}</h5>
                    <p className="text-sm text-slate-600">{flight.aircraft}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600">{flight.price}</p>
                  <p className="text-sm text-slate-500">{flight.class}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <div className="text-center">
                  <p className="font-bold text-slate-800">{flight.departure.time}</p>
                  <p className="text-sm text-slate-600">{flight.departure.airport}</p>
                </div>
                <div className="flex-1 mx-4">
                  <div className="flex items-center">
                    <div className="flex-1 h-px bg-slate-300"></div>
                    <div className="px-3">
                      <span className="text-xs text-slate-500">{flight.duration}</span>
                      <div className="text-xs text-slate-400">
                        {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                      </div>
                    </div>
                    <div className="flex-1 h-px bg-slate-300"></div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-800">{flight.arrival.time}</p>
                  <p className="text-sm text-slate-600">{flight.arrival.airport}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <a
                  href={flight.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 text-white text-center font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Flight
                </a>
                <button className="bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors">
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
