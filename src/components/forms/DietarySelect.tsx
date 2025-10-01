import React from 'react';

interface DietarySelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const DietarySelect: React.FC<DietarySelectProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  return (
    <div>
      <label className="block text-base font-semibold text-slate-700 mb-3">
        Dietary Preferences
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-6 py-4 text-lg border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white text-slate-900 shadow-sm hover:shadow-md"
        disabled={disabled}
      >
        <option value="Any">🍽️ Any - No dietary restrictions</option>
        <option value="Vegetarian">🥬 Vegetarian - Plant-based options</option>
        <option value="Vegan">🌱 Vegan - Strictly plant-based</option>
        <option value="Non-Vegetarian">🥩 Non-Vegetarian - All cuisines welcome</option>
        <option value="Halal">🕌 Halal - Halal-certified restaurants</option>
        <option value="Kosher">✡️ Kosher - Kosher-certified restaurants</option>
      </select>
    </div>
  );
};
