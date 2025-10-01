import React from 'react';

interface SessionWarningProps {
  timeRemaining: number;
  onExtendSession: () => void;
  onSessionExpired: () => void;
}

export const SessionWarning: React.FC<SessionWarningProps> = ({
  timeRemaining,
  onExtendSession,
  onSessionExpired
}) => {
  const minutes = Math.floor(timeRemaining / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  if (timeRemaining <= 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Session Expired</h3>
            <p className="text-gray-600 mb-6">
              Your session has expired due to inactivity. Please refresh the page to continue.
            </p>
            <button
              onClick={onSessionExpired}
              className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-lg z-40 max-w-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-800">Session Warning</p>
          <p className="text-xs text-amber-700">
            Session expires in {minutes}:{seconds.toString().padStart(2, '0')}
          </p>
        </div>
        <button
          onClick={onExtendSession}
          className="bg-amber-600 text-white text-xs font-semibold px-3 py-1 rounded-lg hover:bg-amber-700 transition-colors"
        >
          Extend
        </button>
      </div>
    </div>
  );
};
