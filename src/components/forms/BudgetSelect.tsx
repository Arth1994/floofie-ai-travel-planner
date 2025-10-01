import React from 'react';

interface BudgetSelectProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const BudgetSelect: React.FC<BudgetSelectProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  return (
    <div>
      <label className="block text-base font-semibold text-slate-700 mb-3">
        Budget Range
      </label>
      <select
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full px-6 py-4 text-lg border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white text-slate-900 shadow-sm hover:shadow-md"
        disabled={disabled}
      >
        <option value={500}>💰 Budget ($300-800) - Backpacker friendly</option>
        <option value={1200}>💳 Mid-Range ($800-1,500) - Comfortable travel</option>
        <option value={2500}>🏨 Premium ($1,500-3,000) - Luxury experiences</option>
        <option value={5000}>💎 High-End ($3,000+) - Ultra-luxury travel</option>
      </select>
    </div>
  );
};
