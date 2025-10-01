import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md ${className}`}>
      <svg 
        width={size === 'sm' ? '20' : size === 'md' ? '24' : '28'} 
        height={size === 'sm' ? '20' : size === 'md' ? '24' : '28'} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cute paw print */}
        {/* Main paw pad */}
        <ellipse cx="12" cy="14" rx="4" ry="3.5" fill="#FFFFFF"/>
        
        {/* Top toe pads */}
        <ellipse cx="8.5" cy="9" rx="1.8" ry="1.4" fill="#FFFFFF"/>
        <ellipse cx="12" cy="8.5" rx="1.8" ry="1.4" fill="#FFFFFF"/>
        <ellipse cx="15.5" cy="9" rx="1.8" ry="1.4" fill="#FFFFFF"/>
        
        {/* Bottom toe pad */}
        <ellipse cx="12" cy="11.5" rx="1.5" ry="1.2" fill="#FFFFFF"/>
        
        {/* Small details for texture */}
        <ellipse cx="12" cy="14" rx="2.5" ry="2" fill="#F8FAFC" opacity="0.3"/>
        
        {/* Cute paw lines */}
        <path d="M10 13.5 Q12 14.5 14 13.5" stroke="#E2E8F0" strokeWidth="0.5" fill="none" opacity="0.5"/>
        <path d="M8.5 10.5 Q10 11 11.5 10.5" stroke="#E2E8F0" strokeWidth="0.4" fill="none" opacity="0.4"/>
        <path d="M12.5 10 Q14 10.5 15.5 10" stroke="#E2E8F0" strokeWidth="0.4" fill="none" opacity="0.4"/>
        <path d="M10.5 12 Q12 12.5 13.5 12" stroke="#E2E8F0" strokeWidth="0.4" fill="none" opacity="0.4"/>
      </svg>
    </div>
  );
};
