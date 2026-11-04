// src/lib/availability.test.ts — AC1–AC5 regression suite.
// Practice #07 suite + the only distinct case from the former availability.ai.test.ts (T13b),
// + A3 Python boundary cases (end == 1440, negative start) + single-source duration helpers (E13).
// Run: npx vitest run
import { describe, test, expect } from 'vitest';
import { checkAvailability, exceedsMaxDuration } from './availability';
import { durationOf } from './time';
import type { Booking, Room } from '../types';

// ---------- Fixture (fresh data for every test) ----------
// Default: now = 540 (09:00), blocked = false, one booking 600–660 (10:00–11:00)
const NOW = 540;

function makeRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: 'test-room',
    name: 'Test Room',
    building: 'Test',
    capacity: 10,
    equipment: [],
    blocked: false,
    bookings: [{ start: 600, end: 660, label: 'Sample booking' }],
    ...overrides,
  };
}

function check(start: number, end: number, room: Room = makeRoom(), currentTime = NOW) {
  return checkAvailability({ room, start, end, currentTime });
}

// ---------- AC1: valid interval, start strictly after now ----------
describe('AC1 — time range', () => {
  test('T02: 540–570 starts exactly now → Unavailable', () => {
    const r = check(540, 570);
    expect(r.available).toBe(false);
    expect(r.reason).toMatch(/after the current time \(09:00\)/);
  });

  test('T03: 720–720 zero duration → Unavailable', () => {
    const r = check(720, 720);
    expect(r.available).toBe(false);
    expect(r.reason).toMatch(/earlier than end/);
  });

  test('T04: 750–720 reversed → Unavailable', () => {
    const r = check(750, 720);
    expect(r.available).toBe(false);
    expect(r.reason).toMatch(/earlier than end/);
  });

  test('T05: 1380–1441 past day end → Unavailable', () => {
    const r = check(1380, 1441);
    expect(r.available).toBe(false);
    expect(r.reason).toMatch(/same day/);
  });

  test('A3-1: 1380–1440 ends exactly at midnight → Available', () => {
    expect(check(1380, 1440, makeRoom({ bookings: [] })).available).toBe(true);
  });

  test('A3-2: -10–30 negative start → Unavailable', () => {
    const r = check(-10, 30);
    expect(r.available).toBe(false);
    expect(r.reason).toMatch(/same day/);
  });

  test('C2 (own): 541–600 starts one minute after now → Available', () => {
    // Boundary next to T02: detects a ">=" vs ">" mistake in the now-check
    expect(check(541, 600).available).toBe(true);
  });
});

// ---------- AC2: max 120 minutes ----------
describe('AC2 — duration', () => {
  test('T06: 720–840 exactly 120 min → Available, result carries the duration', () => {
    const r = check(720, 840);
    expect(r.available).toBe(true);
    expect(r.duration).toBe(120);
  });

  test('T07: 720–841 121 min → Unavailable', () => {
    const r = check(720, 841);
    expect(r.available).toBe(false);
    expect(r.reason).toMatch(/cannot exceed 120 minutes/);
  });

  test('exceedsMaxDuration: 120 is allowed, 121 is not (single 120-min decision)', () => {
    expect(exceedsMaxDuration(120)).toBe(false);
    expect(exceedsMaxDuration(121)).toBe(true);
  });

  test('durationOf: positive length, null for empty, reversed or missing ends', () => {
    expect(durationOf(600, 720)).toBe(120);
    expect(durationOf(720, 720)).toBeNull();
    expect(durationOf(750, 720)).toBeNull();
    expect(durationOf(null, 720)).toBeNull();
    expect(durationOf(600, null)).toBeNull();
  });
});

// ---------- AC3: blocked room ----------
describe('AC3 — blocked room', () => {
  test('T13: 660–720, blocked = true → Unavailable', () => {
    // 660–720 is otherwise valid (see T01), so only the block can reject it
    const r = check(660, 720, makeRoom({ blocked: true }));
    expect(r.available).toBe(false);
    expect(r.reason).toMatch(/blocked/);
  });

  test('T13b (from ai suite): blocked with a reason → reason is shown', () => {
    const r = check(660, 720, makeRoom({ blocked: true, blockReason: 'Maintenance' }));
    expect(r.available).toBe(false);
    expect(r.reason).toBe('This room is blocked: Maintenance.');
  });
});

// ---------- AC4: overlap, touching allowed ----------
describe('AC4 — overlap', () => {
  test('T01: 660–720 touching after → Available, no conflict', () => {
    const r = check(660, 720);
    expect(r.available).toBe(true);
    expect(r.conflict).toBeUndefined();
  });

  test('T08: 570–600 touching before → Available', () => {
    expect(check(570, 600).available).toBe(true);
  });

  const overlapCases: Array<[string, number, number]> = [
    ['T09: 630–690 partial overlap', 630, 690],
    ['T10: 570–690 contains booking', 570, 690],
    ['T11: 615–645 inside booking', 615, 645],
    ['T12: 600–660 identical interval', 600, 660],
  ];

  test.each(overlapCases)('%s → Unavailable', (_name, start, end) => {
    const r = check(start, end);
    expect(r.available).toBe(false);
    expect(r.reason).toMatch(/Overlaps/);
    expect(r.conflict).toEqual({ start: 600, end: 660, label: 'Sample booking' });
  });

  test('T14: 630–690, bookings = [] → Available', () => {
    expect(check(630, 690, makeRoom({ bookings: [] })).available).toBe(true);
  });

  test('C1 (own): 660–720 between two bookings, touching both → Available', () => {
    const room = makeRoom({
      bookings: [
        { start: 600, end: 660, label: 'Before' },
        { start: 720, end: 840, label: 'After' },
      ],
    });
    expect(check(660, 720, room).available).toBe(true);
  });

  test('C3 (own): overlap with the second booking only → Unavailable', () => {
    // Detects a loop that checks only the first booking
    const room = makeRoom({
      bookings: [
        { start: 600, end: 660, label: 'First' },
        { start: 720, end: 840, label: 'Second' },
      ],
    });
    const r = check(700, 760, room);
    expect(r.available).toBe(false);
    expect(r.conflict?.label).toBe('Second');
  });
});

// ---------- AC5: decision does not change booking data ----------
describe('AC5 — data preservation', () => {
  test('AC5: repeated checks leave the room and its bookings unchanged', () => {
    const room = makeRoom();
    const before = structuredClone(room);

    check(660, 720, room); // available
    check(630, 690, room); // overlap
    check(720, 841, room); // too long

    expect(room).toEqual(before);
  });

  test('AC5: frozen bookings do not cause errors (no mutation attempted)', () => {
    const bookings: Booking[] = Object.freeze([
      Object.freeze({ start: 600, end: 660, label: 'Frozen' }),
    ]) as Booking[];
    const room = makeRoom({ bookings });
    expect(() => check(630, 690, room)).not.toThrow();
    expect(check(660, 720, room).available).toBe(true);
  });
});
