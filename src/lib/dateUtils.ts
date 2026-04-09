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
