// E10 — F5: the availability check must use the SELECTED room's bookings.
import { describe, test, expect } from 'vitest';
import { checkAvailability } from './availability';
import { SAMPLE_ROOMS } from '@/data';

const NOW = 630; // same fixed "now" as App.tsx (10:30)

function roomById(id: string) {
  const room = SAMPLE_ROOMS.find((r) => r.id === id);
  if (!room) throw new Error(`room ${id} missing from SAMPLE_ROOMS`);
  return room;
}

describe('F5 — check uses the selected room bookings', () => {
  // 13:00–14:00 is booked in Library 201 (780–840) but free in Arts Studio 05
  // (its only booking 840–900 merely touches the request).
  const start = 780;
  const end = 840;

  test('F5: same interval is unavailable in lib-201 (own booking 780–840)', () => {
    const r = checkAvailability({ room: roomById('lib-201'), start, end, currentTime: NOW });
    expect(r.available).toBe(false);
    expect(r.conflict).toEqual({ start: 780, end: 840, label: 'Faculty Meeting' });
  });

  test('F5: switching to arts-05 gives a different result for the same interval', () => {
    const r = checkAvailability({ room: roomById('arts-05'), start, end, currentTime: NOW });
    expect(r.available).toBe(true);
    expect(r.conflict).toBeUndefined();
  });
});
