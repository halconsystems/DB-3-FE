/** Start of local day as ISO date-time (for API FromDate query params). */
export function startOfDayIso(ymd: string): string | undefined {
  if (!ymd?.trim()) return undefined;
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d, 0, 0, 0, 0).toISOString();
}

/** End of local day as ISO date-time (for API ToDate query params). */
export function endOfDayIso(ymd: string): string | undefined {
  if (!ymd?.trim()) return undefined;
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d, 23, 59, 59, 999).toISOString();
}

/**
 * Format a date string to display only the date part (YYYY-MM-DD)
 * Handles various date formats including ISO datetime strings
 */
export function formatDateDisplay(value?: string | null | number): string {
  if (!value) {
    return '-';
  }

  try {
    // Convert to string if number
    const dateStr = String(value);

    // Extract YYYY-MM-DD from various formats
    // Handles: 2024-01-15T10:30:00, 2024-01-15, etc.
    const dateMatch = dateStr.match(/^\d{4}-\d{2}-\d{2}/);
    if (dateMatch) {
      return dateMatch[0];
    }

    // If no match, return as-is
    return dateStr;
  } catch {
    return '-';
  }
}
