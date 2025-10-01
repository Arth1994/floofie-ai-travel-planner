import React from 'react';

interface BudgetSummaryProps {
  result: any;
}

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
      <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
        Budget Summary
      </h3>
      <p className="text-xl mb-2">Total Trip Budget: <span className="font-bold text-2xl">${result.budget}</span></p>
      <p className="text-base opacity-90">Daily Average: <span className="font-semibold text-lg">${Math.floor(result.budget / result.duration)}</span></p>
    </div>
  );
};
