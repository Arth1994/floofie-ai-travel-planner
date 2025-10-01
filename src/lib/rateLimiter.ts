/**
 * Client-side rate limiting utility
 * Prevents abuse by limiting API calls per user session
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly defaultLimit = 10; // requests per minute
  private readonly defaultWindow = 60000; // 1 minute in milliseconds

  constructor(
    private readonly requestsPerMinute: number = this.defaultLimit,
    private readonly windowMs: number = this.defaultWindow
  ) {}

  /**
   * Check if a request is allowed for the given key
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry) {
      // First request from this key
      this.limits.set(key, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return true;
    }

    // Check if window has expired
    if (now > entry.resetTime) {
      // Reset the counter
      this.limits.set(key, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return true;
    }

    // Check if limit exceeded
    if (entry.count >= this.requestsPerMinute) {
      return false;
    }

    // Increment counter
    entry.count++;
    return true;
  }

  /**
   * Get remaining requests for a key
   */
  getRemainingRequests(key: string): number {
    const entry = this.limits.get(key);
    if (!entry) {
      return this.requestsPerMinute;
    }

    const now = Date.now();
    if (now > entry.resetTime) {
      return this.requestsPerMinute;
    }

    return Math.max(0, this.requestsPerMinute - entry.count);
  }

  /**
   * Get time until reset for a key
   */
  getResetTime(key: string): number {
    const entry = this.limits.get(key);
    if (!entry) {
      return 0;
    }

    const now = Date.now();
    return Math.max(0, entry.resetTime - now);
  }

  /**
   * Clear all rate limit data
   */
  clear(): void {
    this.limits.clear();
  }
}

// Create a global rate limiter instance
export const rateLimiter = new RateLimiter();

/**
 * Generate a unique key for rate limiting based on user IP or session
 */
export function generateRateLimitKey(): string {
  // In a real app, this would be based on user IP or session ID
  // For client-side, we'll use a combination of factors
  const userAgent = navigator.userAgent;
  const language = navigator.language;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Create a simple hash of these values
  const combined = `${userAgent}-${language}-${timezone}`;
  return btoa(combined).substring(0, 16);
}

/**
 * Check if request is rate limited
 */
export function checkRateLimit(): { allowed: boolean; remaining: number; resetTime: number } {
  const key = generateRateLimitKey();
  const allowed = rateLimiter.isAllowed(key);
  const remaining = rateLimiter.getRemainingRequests(key);
  const resetTime = rateLimiter.getResetTime(key);

  return {
    allowed,
    remaining,
    resetTime
  };
}

/**
 * Hook for React components to use rate limiting
 */
export function useRateLimit() {
  const checkLimit = () => {
    const result = checkRateLimit();
    
    if (!result.allowed) {
      const resetSeconds = Math.ceil(result.resetTime / 1000);
      throw new Error(`Rate limit exceeded. Please try again in ${resetSeconds} seconds.`);
    }
    
    return result;
  };

  return {
    checkLimit,
    getRemainingRequests: () => rateLimiter.getRemainingRequests(generateRateLimitKey()),
    getResetTime: () => rateLimiter.getResetTime(generateRateLimitKey())
  };
}
