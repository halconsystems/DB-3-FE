/** Groups numeric card / RFID strings as "1234 5678 1234 5678" for display. */
export function formatCardNumberDisplay(value: unknown): string {
  const raw = String(value ?? '').trim();
  if (!raw || raw === '-') return raw === '-' ? '-' : '';

  const digits = raw.replace(/\D/g, '');
  if (!digits) {
    return raw;
  }

  const chunks: string[] = [];
  for (let i = 0; i < digits.length; i += 4) {
    chunks.push(digits.slice(i, i + 4));
  }
  return chunks.join(' ');
}

export function stripCardNumberFormatting(value: unknown): string {
  return String(value ?? '').replace(/\D/g, '');
}
