const decodeBase64Url = (value: string): string => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

  if (typeof atob !== 'function') {
    return '';
  }

  const decoded = atob(padded);
  try {
    // Preserve UTF-8 characters when token payload contains non-ascii values.
    return decodeURIComponent(
      decoded
        .split('')
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    );
  } catch {
    return decoded;
  }
};

export const decodeJwtPayload = (token?: string | null): Record<string, any> | null => {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length < 2) return null;

  try {
    const json = decodeBase64Url(parts[1]);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const JWT_ID_CLAIMS = [
  'nameid',
  'nameidentifier',
  'sub',
  'id',
  'userId',
  'uid',
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid',
];

export const getUserIdFromToken = (token?: string | null): string | null => {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  for (const claim of JWT_ID_CLAIMS) {
    const value = payload[claim];
    if (value !== null && value !== undefined && String(value).trim() !== '') {
      return String(value);
    }
  }

  return null;
};
