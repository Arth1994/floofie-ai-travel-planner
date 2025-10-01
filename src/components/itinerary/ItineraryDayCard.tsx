import React from 'react';

interface ItineraryDayCardProps {
  day: any;
}

// Helper function to format ratings consistently
const formatRating = (rating: number): string => {
  return typeof rating === 'number' ? rating.toFixed(1) : '4.5';
};

// Helper function to format reviews count
const formatReviews = (reviews: number): string => {
  if (reviews >= 1000) {
    return `${Math.round(reviews / 100) / 10}k`;
  }
  return reviews.toString();
};

export const ItineraryDayCard: React.FC<ItineraryDayCardProps> = ({ day }) => {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 shadow-lg p-6 md:p-8">
      <h4 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <span className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
          {day.day}
        </span>
        Day {day.day}
      </h4>

      {/* Activities with Paw Navigation */}
      <div className="space-y-6 mb-6">
        {/* Morning */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100 relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-blue-400 to-blue-600 rounded-l-xl" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">🌅 Morning</span>
            <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">{day.morning.time}</span>
          </div>
          <h5 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">{day.morning.name}</h5>
          <p className="text-sm text-slate-600 mb-3 font-medium">{day.morning.type}</p>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold border border-amber-200">
              ⭐ {formatRating(day.morning.rating)}
            </span>
            <span className="text-sm text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {day.morning.cost}
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">{day.morning.address}</p>
          <div className="flex gap-2 flex-wrap">
            <a href={day.morning.mapsUrl} target="_blank" rel="noopener noreferrer" 
               className="text-xs bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 font-semibold shadow-sm hover:shadow-md">
              📍 Maps
            </a>
            <a href={day.morning.bookingUrl} target="_blank" rel="noopener noreferrer" 
               className="text-xs bg-emerald-500 text-white px-3 py-2 rounded-lg hover:bg-emerald-600 transition-all duration-200 font-semibold shadow-sm hover:shadow-md">
              🎫 Book
            </a>
          </div>
        </div>

        {/* Paw Navigation 1 */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl animate-bounce">🐾</span>
            <span className="text-xs text-slate-500 font-medium">Next Adventure</span>
          </div>
        </div>

        {/* Afternoon */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-emerald-100 relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-l-xl" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">☀️ Afternoon</span>
            <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">{day.afternoon.time}</span>
          </div>
          <h5 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">{day.afternoon.name}</h5>
          <p className="text-sm text-slate-600 mb-3 font-medium">{day.afternoon.type}</p>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold border border-amber-200">
              ⭐ {formatRating(day.afternoon.rating)}
            </span>
            <span className="text-sm text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {day.afternoon.cost}
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">{day.afternoon.address}</p>
          <div className="flex gap-2 flex-wrap">
            <a href={day.afternoon.mapsUrl} target="_blank" rel="noopener noreferrer" 
               className="text-xs bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 font-semibold shadow-sm hover:shadow-md">
              📍 Maps
            </a>
            <a href={day.afternoon.bookingUrl} target="_blank" rel="noopener noreferrer" 
               className="text-xs bg-emerald-500 text-white px-3 py-2 rounded-lg hover:bg-emerald-600 transition-all duration-200 font-semibold shadow-sm hover:shadow-md">
              🎫 Book
            </a>
          </div>
        </div>

        {/* Paw Navigation 2 */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>🐾</span>
            <span className="text-xs text-slate-500 font-medium">Next Adventure</span>
          </div>
        </div>

        {/* Evening */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-indigo-100 relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-indigo-400 to-indigo-600 rounded-l-xl" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">🌙 Evening</span>
            <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">{day.evening.time}</span>
          </div>
          <h5 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">{day.evening.name}</h5>
          <p className="text-sm text-slate-600 mb-3 font-medium">{day.evening.type}</p>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold border border-amber-200">
              ⭐ {formatRating(day.evening.rating)}
            </span>
            <span className="text-sm text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {day.evening.cost}
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">{day.evening.address}</p>
          <div className="flex gap-2 flex-wrap">
            <a href={day.evening.mapsUrl} target="_blank" rel="noopener noreferrer" 
               className="text-xs bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 font-semibold shadow-sm hover:shadow-md">
              📍 Maps
            </a>
            <a href={day.evening.bookingUrl} target="_blank" rel="noopener noreferrer" 
               className="text-xs bg-emerald-500 text-white px-3 py-2 rounded-lg hover:bg-emerald-600 transition-all duration-200 font-semibold shadow-sm hover:shadow-md">
              🎫 Book
            </a>
          </div>
        </div>
      </div>

      {/* Dining */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 mb-6 shadow-sm border border-amber-200">
        <h5 className="text-xl font-bold text-amber-800 mb-6 flex items-center gap-2">
          🍽️ Dining Experience 🎋
        </h5>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Breakfast */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-amber-100 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
              <span className="text-sm font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">🎋 🌅 Breakfast</span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold border border-amber-200">
                  ⭐ {formatRating(day.dining.breakfast.rating)}
                </span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold border border-blue-200">
                  {formatReviews(day.dining.breakfast.reviews)} reviews
                </span>
              </div>
            </div>
            <h6 className="text-base font-bold text-slate-800 mb-2 line-clamp-2">{day.dining.breakfast.name}</h6>
            <p className="text-sm text-slate-600 mb-2 font-medium">{day.dining.breakfast.type}</p>
            <p className="text-sm text-purple-600 mb-2 font-semibold">🥬 {day.dining.breakfast.dietary || 'Any'}</p>
            <p className="text-lg text-emerald-700 font-bold mb-4 bg-emerald-50 px-3 py-1 rounded-full inline-block border border-emerald-200">
              {day.dining.breakfast.price}
            </p>
            <div className="flex gap-2 flex-wrap">
              <a href={day.dining.breakfast.mapsUrl} target="_blank" rel="noopener noreferrer" 
                 className="text-xs bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 font-semibold shadow-sm hover:shadow-md">
                📍 Maps
              </a>
              <a href={day.dining.breakfast.bookingUrl} target="_blank" rel="noopener noreferrer" 
                 className="text-xs bg-emerald-500 text-white px-3 py-2 rounded-lg hover:bg-emerald-600 transition-all duration-200 font-semibold shadow-sm hover:shadow-md">
                🍽️ Book
              </a>
            </div>
          </div>

          {/* Lunch */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-amber-100 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
              <span className="text-sm font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">🎋 ☀️ Lunch</span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold border border-amber-200">
                  ⭐ {formatRating(day.dining.lunch.rating)}
                </span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold border border-blue-200">
                  {formatReviews(day.dining.lunch.reviews)} reviews
                </span>
              </div>
            </div>
            <h6 className="text-base font-bold text-slate-800 mb-2 line-clamp-2">{day.dining.lunch.name}</h6>
            <p className="text-sm text-slate-600 mb-2 font-medium">{day.dining.lunch.type}</p>
            <p className="text-sm text-purple-600 mb-2 font-semibold">🥬 {day.dining.lunch.dietary || 'Any'}</p>
            <p className="text-lg text-emerald-700 font-bold mb-4 bg-emerald-50 px-3 py-1 rounded-full inline-block border border-emerald-200">
              {day.dining.lunch.price}
            </p>
            <div className="flex gap-2 flex-wrap">
              <a href={day.dining.lunch.mapsUrl} target="_blank" rel="noopener noreferrer" 
                 className="text-xs bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 font-semibold shadow-sm hover:shadow-md">
                📍 Maps
              </a>
              <a href={day.dining.lunch.bookingUrl} target="_blank" rel="noopener noreferrer" 
                 className="text-xs bg-emerald-500 text-white px-3 py-2 rounded-lg hover:bg-emerald-600 transition-all duration-200 font-semibold shadow-sm hover:shadow-md">
                🍽️ Book
              </a>
            </div>
          </div>

          {/* Dinner */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-amber-100 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
              <span className="text-sm font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">🎋 🌙 Dinner</span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold border border-amber-200">
                  ⭐ {formatRating(day.dining.dinner.rating)}
                </span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold border border-blue-200">
                  {formatReviews(day.dining.dinner.reviews)} reviews
                </span>
              </div>
            </div>
            <h6 className="text-base font-bold text-slate-800 mb-2 line-clamp-2">{day.dining.dinner.name}</h6>
            <p className="text-sm text-slate-600 mb-2 font-medium">{day.dining.dinner.type}</p>
            <p className="text-sm text-purple-600 mb-2 font-semibold">🥬 {day.dining.dinner.dietary || 'Any'}</p>
            <p className="text-lg text-emerald-700 font-bold mb-4 bg-emerald-50 px-3 py-1 rounded-full inline-block border border-emerald-200">
              {day.dining.dinner.price}
            </p>
            <div className="flex gap-2 flex-wrap">
              <a href={day.dining.dinner.mapsUrl} target="_blank" rel="noopener noreferrer" 
                 className="text-xs bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 font-semibold shadow-sm hover:shadow-md">
                📍 Maps
              </a>
              <a href={day.dining.dinner.bookingUrl} target="_blank" rel="noopener noreferrer" 
                 className="text-xs bg-emerald-500 text-white px-3 py-2 rounded-lg hover:bg-emerald-600 transition-all duration-200 font-semibold shadow-sm hover:shadow-md">
                🍽️ Book
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Accommodation */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-6 shadow-sm border border-slate-200">
        <h5 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
          🏨 Accommodation
        </h5>
        <div className="bg-white rounded-lg p-4 border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm bg-amber-100 text-amber-700 px-3 py-2 rounded-full font-semibold border border-amber-200">
                ⭐ {formatRating(day.accommodation.rating)}
              </span>
              <h6 className="text-lg font-bold text-slate-800 line-clamp-1">{day.accommodation.name}</h6>
            </div>
            <p className="text-xl text-emerald-700 font-bold bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
              {day.accommodation.price}
            </p>
          </div>
          <p className="text-sm text-slate-600 mb-4 font-medium">{day.accommodation.type}</p>
          <div className="flex gap-3 flex-wrap">
            <a href={day.accommodation.mapsUrl} target="_blank" rel="noopener noreferrer" 
               className="text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 font-semibold shadow-sm hover:shadow-md">
              📍 View Location
            </a>
            <a href={day.accommodation.bookingUrl} target="_blank" rel="noopener noreferrer" 
               className="text-sm bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md">
              🏨 Book Hotel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
