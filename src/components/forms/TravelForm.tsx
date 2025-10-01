import React from 'react';
import { type TravelFormData } from '../../lib/validation';
import { DestinationInput } from './DestinationInput';
import { DurationInput } from './DurationInput';
import { BudgetSelect } from './BudgetSelect';
import { ThemeSelect } from './ThemeSelect';
import { DietarySelect } from './DietarySelect';

interface TravelFormProps {
  formData: TravelFormData;
  onFormDataChange: (data: TravelFormData) => void;
  onSubmit: () => void;
  isLoading: boolean;
  user: any;
}

export const TravelForm: React.FC<TravelFormProps> = ({
  formData,
  onFormDataChange,
  onSubmit,
  isLoading,
  user
}) => {
  const updateFormData = (updates: Partial<TravelFormData>) => {
    onFormDataChange({ ...formData, ...updates });
  };

  return (
    <div className={`rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 mb-12 ${
      !user ? 'bg-gray-50 opacity-75' : 'bg-white'
    }`}>
      <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Plan Your Next Adventure
      </h2>

      <div className="space-y-8">
        <DestinationInput
          value={formData.destination}
          onChange={(destination) => updateFormData({ destination })}
          disabled={!user}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <DurationInput
            value={formData.duration}
            onChange={(duration) => updateFormData({ duration })}
            disabled={!user}
          />
          
          <BudgetSelect
            value={formData.budget}
            onChange={(budget) => updateFormData({ budget })}
            disabled={!user}
          />
        </div>

        <ThemeSelect
          value={formData.theme}
          onChange={(theme) => updateFormData({ theme })}
          disabled={!user}
        />

        <DietarySelect
          value={formData.dietary || 'Any'}
          onChange={(dietary) => updateFormData({ dietary })}
          disabled={!user}
        />

        <button
          onClick={onSubmit}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-5 px-8 rounded-2xl shadow-xl hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg"
          disabled={isLoading || !user}
        >
          {isLoading ? (
            <>
              <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Floofie's Funventure...
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate AI Itinerary
            </>
          )}
        </button>
      </div>
    </div>
  );
};
