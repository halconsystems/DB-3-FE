// src/lib/getExternalUserId.ts

/**
 * Returns the external user id from localStorage, or 'system' as fallback.
 * Checks for user.id, user.userId, user.email in order.
 */
export function getExternalUserId(): string {
  if (typeof window === 'undefined') return 'system';
  const userRaw = localStorage.getItem('user');
  if (!userRaw) return 'system';
  try {
    const user = JSON.parse(userRaw);
    return user?.id || user?.userId || user?.email || 'system';
  } catch {
    return 'system';
  }
}
