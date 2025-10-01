import { useState, useEffect, useCallback } from 'react';

interface SessionManager {
  isSessionActive: boolean;
  timeRemaining: number;
  extendSession: () => void;
  resetSession: () => void;
  warningShown: boolean;
}

export const useSessionManager = (
  timeoutDuration: number = 30 * 60 * 1000, // 30 minutes default
  warningThreshold: number = 5 * 60 * 1000  // 5 minutes warning
): SessionManager => {
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(timeoutDuration);
  const [warningShown, setWarningShown] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Activity tracking events
  const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
    setIsSessionActive(true);
    setWarningShown(false);
  }, []);

  const extendSession = useCallback(() => {
    setLastActivity(Date.now());
    setIsSessionActive(true);
    setWarningShown(false);
    setTimeRemaining(timeoutDuration);
  }, [timeoutDuration]);

  const resetSession = useCallback(() => {
    setLastActivity(Date.now());
    setIsSessionActive(true);
    setWarningShown(false);
    setTimeRemaining(timeoutDuration);
  }, [timeoutDuration]);

  useEffect(() => {
    // Add event listeners for activity tracking
    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Session timeout management
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;
      const remaining = timeoutDuration - timeSinceLastActivity;

      setTimeRemaining(Math.max(0, remaining));

      // Show warning when approaching timeout
      if (remaining <= warningThreshold && remaining > 0 && !warningShown) {
        setWarningShown(true);
      }

      // Session expired
      if (remaining <= 0 && isSessionActive) {
        setIsSessionActive(false);
        setWarningShown(false);
      }
    }, 1000); // Check every second

    return () => {
      // Cleanup event listeners
      activityEvents.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
      clearInterval(interval);
    };
  }, [lastActivity, timeoutDuration, warningThreshold, warningShown, isSessionActive, updateActivity]);

  return {
    isSessionActive,
    timeRemaining,
    extendSession,
    resetSession,
    warningShown
  };
};
