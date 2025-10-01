import React from 'react';

interface ActionButtonsProps {
  result: any;
  onCreateGoogleDocs: (itinerary: any) => void;
  onAddToGoogleCalendar: (itinerary: any) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  result,
  onCreateGoogleDocs,
  onAddToGoogleCalendar
}) => {
  if (!result) return null;

  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-4">
      <button
        onClick={() => onCreateGoogleDocs(result)}
        className="flex-1 bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Create Itinerary in Google Docs
      </button>
      <button
        onClick={() => onAddToGoogleCalendar(result)}
        className="flex-1 bg-emerald-600 text-white font-bold py-4 px-6 rounded-2xl hover:bg-emerald-700 transition-all duration-300 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Add to Google Calendar
      </button>
    </div>
  );
};
