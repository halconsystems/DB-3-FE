/**
 * Converts various status representations to a boolean value
 * Used for normalizing status values from API/table data to statusSwitch boolean format
 */
export function normalizeStatusValue(value: any): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value === 1 || value > 0;
  }

  if (typeof value === 'string') {
    const normalized = value.toLowerCase().trim();
    return (
      normalized === '1' ||
      normalized === 'active' ||
      normalized === 'true' ||
      normalized === 'yes' ||
      normalized === 'on'
    );
  }

  return false;
}

export function normalizeFormStatuses(
  data: Record<string, any>,
  statusFieldNames: string[] = ['status', 'isActive', 'cardStatus', 'tagStatus']
): Record<string, any> {
  const normalized = { ...data };

  statusFieldNames.forEach((fieldName) => {
    if (fieldName in normalized) {
      normalized[fieldName] = normalizeStatusValue(normalized[fieldName]);
    }
  });

  return normalized;
}
