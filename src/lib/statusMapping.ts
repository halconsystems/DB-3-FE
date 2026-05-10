// Status mapping for different table types
// Maps numeric or string values to labels and colors

export interface StatusConfig {
  label: string;
  color: string;
  bg: string;
}

export interface StatusMap {
  [key: string | number]: StatusConfig;
}

// ============================================================================
// Define all unique status types ONCE with their styling
// ============================================================================
const STATUS_TYPES = {
  draft: { label: 'Draft', color: '#666', bg: '#eee' },
  encoded: { label: 'Encoded', color: '#1976d2', bg: '#e3f2fd' },
  active: { label: 'Active', color: '#30B33D', bg: '#30B33D1A' },
  suspended: { label: 'Suspended', color: '#FEBE00', bg: '#FEBE001A' },
  blacklisted: { label: 'Blacklisted', color: '#d32f2f', bg: '#ffebee' },
  replaced: { label: 'Replaced', color: '#FF0000', bg: '#FF00001A' },
  expired: { label: 'Expired', color: '#FF0000', bg: '#FF00001A' },
  unknown: { label: 'Unknown', color: '#999', bg: '#f5f5f5' },
  blocked: { label: 'Blocked',  color: '#FEBE00', bg: '#FEBE001A' },
  inactive: { label: 'Inactive', color: '#d32f2f', bg: '#ffebee' },
  private: { label: 'Private', color: '#1976d2', bg: '#e3f2fd' },
  official: { label: 'Official', color: '#388e3c', bg: '#e8f5e9' },
  service: { label: 'Service', color: '#f9a825', bg: '#fffde7' },
  commercial: { label: 'Commercial', color: '#d32f2f', bg: '#ffebee' },
  pending: { label: 'Pending', color: '#ff9800', bg: '#fff3e0' },
};

// ============================================================================
// Map enums to status types (reusing definitions from above)
// ============================================================================

/** API CardStatus: Active=1, Suspended=2, Expired=3, Pending=4 */
export const cardStatusMap: StatusMap = {
  1: STATUS_TYPES.active,
  2: STATUS_TYPES.suspended,
  3: STATUS_TYPES.expired,
  4: STATUS_TYPES.pending,
};

export const userFamilyCardStatusMap: StatusMap = {
  ...cardStatusMap,
};

/** Vehicle tag / card status aligned with domain CardStatus (1–4). */
export const tagStatusMap: StatusMap = {
  0: STATUS_TYPES.unknown,
  1: STATUS_TYPES.active,
  2: STATUS_TYPES.suspended,
  3: STATUS_TYPES.expired,
  4: STATUS_TYPES.pending,
};

// VehicleCategory enum mapping (0-3)
export const vehicleCategoryMap: StatusMap = {
  0: STATUS_TYPES.private,
  1: STATUS_TYPES.official,
  2: STATUS_TYPES.service,
  3: STATUS_TYPES.commercial,
};

// Active/Inactive status mapping (boolean, 0, 1, string)
export const activeInactiveStatusMap: StatusMap = {
  true: STATUS_TYPES.active,
  false: STATUS_TYPES.inactive,
  1: STATUS_TYPES.active,
  0: STATUS_TYPES.inactive,
  'Active': STATUS_TYPES.active,
  'Inactive': STATUS_TYPES.inactive,
};



// All status mappings by table type
export const statusMappings: Record<string, StatusMap> = {
  userFamily: userFamilyCardStatusMap,
  cardStatus: cardStatusMap,
  tagStatus: tagStatusMap,
  vehicleCategory: vehicleCategoryMap,
  activeInactive: activeInactiveStatusMap, 
};

/** Coerce API enum / query values to a number for filters and badges, or null if empty/invalid. */
export const normalizeNumericEnum = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const n = typeof value === 'number' ? value : Number(String(value).trim());
  return Number.isNaN(n) ? null : n;
};

// Get status config for a specific table type and value
export const getStatusConfig = (
  tableType: string,
  value: string | number | boolean | null | undefined
): StatusConfig | null => {

  const statusMap = statusMappings[tableType];
  if (!statusMap || value === null || value === undefined) {
    return null;
  }

  // Try direct lookup (convert value to string for comparison)
  const stringValue = String(value);
  if (stringValue in statusMap) {
    return statusMap[stringValue];
  }

  // Try number lookup
  if (typeof value === 'number' && value in statusMap) {
    return statusMap[value];
  }

  // Try boolean conversion for active/inactive
  if (tableType === 'activeInactive') {
    if (value === true || value === 1 || value === '1' || stringValue.toLowerCase() === 'active') {
      return activeInactiveStatusMap['Active'];
    }
    if (value === false || value === 0 || value === '0' || stringValue.toLowerCase() === 'inactive') {
      return activeInactiveStatusMap['Inactive'];
    }
  }

  return null;
};
