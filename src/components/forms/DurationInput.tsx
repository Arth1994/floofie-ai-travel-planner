import React from 'react';

interface DurationInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const DurationInput: React.FC<DurationInputProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const handleDecrease = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < 30) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      onChange(3);
      return;
    }
    const numValue = parseInt(inputValue);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 30) {
      onChange(numValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '' || isNaN(parseInt(inputValue)) || parseInt(inputValue) < 1) {
      onChange(3);
    }
  };

  return (
    <div>
      <label className="block text-base font-semibold text-slate-700 mb-3">
        Duration (days)
      </label>
      <div className="relative">
        {/* Decrease Button */}
        <button
          type="button"
          onClick={handleDecrease}
          disabled={disabled || value <= 1}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-400 rounded-xl flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed"
        >
          <span className="text-lg font-bold">−</span>
        </button>
        
        {/* Input Field */}
        <input
          type="number"
          min="1"
          max="30"
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="w-full pl-14 pr-14 py-4 text-lg border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white text-slate-900 shadow-sm hover:shadow-md text-center font-semibold"
          disabled={disabled}
          placeholder="3"
          style={{ colorScheme: 'light' }}
        />
        
        {/* Increase Button */}
        <button
          type="button"
          onClick={handleIncrease}
          disabled={disabled || value >= 30}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-400 rounded-xl flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed"
        >
          <span className="text-lg font-bold">+</span>
        </button>
      </div>
      
      {/* Duration Helper Text */}
      <div className="mt-2 flex justify-between text-sm text-slate-500">
        <span>Minimum: 1 day</span>
        <span>Maximum: 30 days</span>
      </div>
    </div>
  );
};
