// Simple, readable per-IP rate limiter
const attempts = new Map();

export function rateLimit(ip, limit = 5, windowMs = 60_000) {
  const now = Date.now();

  // record exists?
  if (!attempts.has(ip)) {
    attempts.set(ip, { count: 1, time: now });
    return { allowed: true };
  }

  const entry = attempts.get(ip);

  // window expired → reset
  if (now - entry.time > windowMs) {
    attempts.set(ip, { count: 1, time: now });
    return { allowed: true };
  }

  // same window → increment
  entry.count++;

  // update
  attempts.set(ip, entry);

  if (entry.count > limit) {
    return { allowed: false };
  }

  return { allowed: true };
}
