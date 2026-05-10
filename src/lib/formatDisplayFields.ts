import { formatCardNumberDisplay } from './formatCardNumber';

const toDigitsOnly = (value: unknown): string => String(value ?? '').replace(/\D/g, '');

/** CNIC / NICOP display XXXXX-XXXXXXX-X */
export function formatCnicDisplay(value: unknown): string {
  const digits = toDigitsOnly(value).slice(0, 13);
  if (!digits) return '';
  if (digits.length <= 5) return digits;
  if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
}

/** PK-style mobile display 03XX-XXXXXXX */
export function formatPhoneDisplay(value: unknown): string {
  const raw = String(value ?? '').trim();
  if (!raw) return '';

  let digits = toDigitsOnly(raw);
  if (digits.startsWith('92')) {
    digits = `0${digits.slice(2)}`;
  }
  digits = digits.slice(0, 11);
  if (!digits) return '';
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
}

/** Table cell: empty / null / undefined → "-" */
export function displayDash(value: unknown): string {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'string' && value.trim() === '') return '-';
  return String(value);
}

/** Format CNIC for table (raw API → dashed); blank → "-" */
export function tableCnic(value: unknown): string {
  const formatted = formatCnicDisplay(value);
  return formatted || '-';
}

/** Format phone for table; blank → "-" */
export function tablePhone(value: unknown): string {
  const formatted = formatPhoneDisplay(value);
  return formatted || '-';
}

/** Format RFID / card for table; blank → "-" */
export function tableCardNumber(value: unknown): string {
  const raw = String(value ?? '').trim();
  if (!raw) return '-';
  return formatCardNumberDisplay(raw);
}
