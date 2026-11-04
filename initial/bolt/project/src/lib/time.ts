export const MIN_DAY = 0;
export const MAX_DAY = 1440;
export const MAX_BOOKING_MINUTES = 120;

export function minutesToHHMM(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function hhmmToMinutes(hhmm: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(hhmm);
  if (!match) return null;
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (h < 0 || h > 24 || m < 0 || m > 59) return null;
  if (h === 24 && m !== 0) return null;
  return h * 60 + m;
}

export function formatRange(start: number, end: number): string {
  return `${minutesToHHMM(start)} – ${minutesToHHMM(end)}`;
}
