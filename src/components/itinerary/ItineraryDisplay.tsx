import React from 'react';
import { ItineraryDayCard } from './ItineraryDayCard';
import { BudgetSummary } from './BudgetSummary';
import { ActionButtons } from './ActionButtons';

interface ItineraryDisplayProps {
  result: any;
  onCreateGoogleDocs: (itinerary: any) => void;
  onAddToGoogleCalendar: (itinerary: any) => void;
}

export const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({
  result,
  onCreateGoogleDocs,
  onAddToGoogleCalendar
}) => {
  if (!result) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-3">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Your {result.duration}-Day {result.theme} Adventure
        </h3>
        <p className="text-xl text-slate-600 font-semibold">✨ {result.destination} • Budget: ${result.budget}</p>
      </div>

      <div className="space-y-8">
        {result.days.map((day: any, index: number) => (
          <ItineraryDayCard key={index} day={day} />
        ))}
      </div>

      <BudgetSummary result={result} />
      <ActionButtons 
        result={result}
        onCreateGoogleDocs={onCreateGoogleDocs}
        onAddToGoogleCalendar={onAddToGoogleCalendar}
      />
    </div>
  );
};
