import React from 'react';

interface DestinationInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const DestinationInput: React.FC<DestinationInputProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  return (
    <div>
      <label className="block text-base font-semibold text-slate-700 mb-3">
        Destination
      </label>
      <input
        type="text"
        placeholder="Where do you want to go?"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-6 py-4 text-lg border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white text-slate-900 shadow-sm hover:shadow-md"
        disabled={disabled}
        style={{ colorScheme: 'light' }}
      />
    </div>
  );
};
