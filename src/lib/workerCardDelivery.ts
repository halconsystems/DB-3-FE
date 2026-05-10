/** Maps form values to API `WorkerCardDeliveryType` (OwnerOrEmployeerAddress = 1, SelfPickUp = 2). */
export function workerCardDeliveryToApi(formValue?: string): number {
  const n = String(formValue ?? '').trim().toLowerCase();
  if (n === 'self' || n === 'selfpickup') return 2;
  return 1;
}

/** Maps API value to form select (`owner` | `self`). API: 1 = OwnerOrEmployeerAddress, 2 = SelfPickUp; 0 = treat as owner. */
export function workerCardDeliveryToFormValue(apiValue?: number | string | null): string {
  if (apiValue === null || apiValue === undefined || apiValue === '') return 'owner';
  const n = typeof apiValue === 'string' ? Number(String(apiValue).trim()) : apiValue;
  if (Number.isNaN(n as number)) return 'owner';
  if (n === 2) return 'self';
  return 'owner';
}
