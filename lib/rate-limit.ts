import { RateLimitInfo } from './types';

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, RateLimitInfo>();

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10');

/**
 * Check if a wallet has exceeded rate limits
 */
export function checkRateLimit(wallet: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const stored = rateLimitStore.get(wallet);

  // No previous requests or window expired
  if (!stored || now >= stored.resetAt) {
    const resetAt = now + WINDOW_MS;
    rateLimitStore.set(wallet, {
      wallet,
      requests: 1,
      resetAt,
    });

    return {
      allowed: true,
      remaining: MAX_REQUESTS - 1,
      resetAt,
    };
  }

  // Within window
  if (stored.requests >= MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: stored.resetAt,
    };
  }

  // Increment counter
  stored.requests += 1;
  rateLimitStore.set(wallet, stored);

  return {
    allowed: true,
    remaining: MAX_REQUESTS - stored.requests,
    resetAt: stored.resetAt,
  };
}

/**
 * Clear rate limit for a wallet (admin use)
 */
export function clearRateLimit(wallet: string): void {
  rateLimitStore.delete(wallet);
}

/**
 * Get current rate limit info for a wallet
 */
export function getRateLimitInfo(wallet: string): RateLimitInfo | null {
  return rateLimitStore.get(wallet) || null;
}
