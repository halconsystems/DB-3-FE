const TABLE_ROW_STORAGE_PREFIX = 'table-edit-row:';

function getStorageKey(scope: string) {
  return `${TABLE_ROW_STORAGE_PREFIX}${scope}`;
}


export function saveTableRow<T>(scope: string, row: T) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(getStorageKey(scope), JSON.stringify(row));
}


export function getTableRow<T>(scope: string): T | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const serializedRow = window.localStorage.getItem(getStorageKey(scope));
  if (!serializedRow) {
    return null;
  }
  try {
    return JSON.parse(serializedRow) as T;
  } catch {
    return null;
  }
}


export function clearTableRow(scope: string) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(getStorageKey(scope));
}
