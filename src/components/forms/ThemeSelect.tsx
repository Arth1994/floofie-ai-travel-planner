import React from 'react';

interface ThemeSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const ThemeSelect: React.FC<ThemeSelectProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  return (
    <div>
      <label className="block text-base font-semibold text-slate-700 mb-3">
        🐼 Activity Type & Theme
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-6 py-4 text-lg border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white text-slate-900 shadow-sm hover:shadow-md"
        disabled={disabled}
      >
        <optgroup label="🧘 Leisure & Wellness">
          <option value="Spa & Wellness">🎋 Spa & Wellness - Rejuvenating treatments</option>
          <option value="Beach Relaxation">🏖️ Beach Relaxation - Coastal serenity</option>
          <option value="Yoga Retreat">🧘 Yoga Retreat - Mindful experiences</option>
          <option value="Meditation">🕯️ Meditation - Inner peace journeys</option>
        </optgroup>
        <optgroup label="🏃 Adventure & Sports">
          <option value="Water Sports">🏄 Water Sports - Aquatic adventures</option>
          <option value="Hiking & Trekking">🥾 Hiking & Trekking - Mountain exploration</option>
          <option value="Extreme Sports">🎢 Extreme Sports - Thrill seeking</option>
          <option value="Cycling Tours">🚴 Cycling Tours - Two-wheel adventures</option>
        </optgroup>
        <optgroup label="🎨 Cultural & Arts">
          <option value="Museums & Galleries">🖼️ Museums & Galleries - Artistic discovery</option>
          <option value="Historical Sites">🏛️ Historical Sites - Time travel experiences</option>
          <option value="Local Traditions">🎭 Local Traditions - Cultural immersion</option>
          <option value="Art Workshops">🎨 Art Workshops - Creative expression</option>
        </optgroup>
        <optgroup label="🍽️ Food & Dining">
          <option value="Culinary Tours">🍳 Culinary Tours - Taste adventures</option>
          <option value="Wine Tasting">🍷 Wine Tasting - Vineyard experiences</option>
          <option value="Street Food">🌮 Street Food - Local flavors</option>
          <option value="Cooking Classes">👨‍🍳 Cooking Classes - Culinary skills</option>
        </optgroup>
        <optgroup label="🌿 Nature & Wildlife">
          <option value="Wildlife Safari">🦁 Wildlife Safari - Animal encounters</option>
          <option value="Botanical Gardens">🌺 Botanical Gardens - Floral paradise</option>
          <option value="National Parks">🌲 National Parks - Natural wonders</option>
          <option value="Bird Watching">🦜 Bird Watching - Feathered friends</option>
        </optgroup>
        <optgroup label="🏙️ Urban & Modern">
          <option value="City Exploration">🏙️ City Exploration - Urban adventures</option>
          <option value="Shopping Districts">🛍️ Shopping Districts - Retail therapy</option>
          <option value="Nightlife">🌃 Nightlife - Evening entertainment</option>
          <option value="Tech & Innovation">💻 Tech & Innovation - Future experiences</option>
        </optgroup>
      </select>
    </div>
  );
};
