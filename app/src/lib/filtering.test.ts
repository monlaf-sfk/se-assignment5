// E11 — F1–F4 filter rules (pure logic, no UI).
import { describe, test, expect } from 'vitest';
import { filterRooms, hasSelectableRoom } from './filtering';
import { SAMPLE_ROOMS } from '@/data';
import type { Room } from '@/types';

function room(id: string, capacity: number, equipment: string[], blocked = false): Room {
  return { id, name: id, building: 'Test', capacity, equipment, blocked, bookings: [] };
}

const ROOMS: Room[] = [
  room('small', 8, ['whiteboard']),
  room('big', 30, ['projector', 'whiteboard', 'computers']),
  room('studio', 16, ['projector', 'sound-system']),
  room('locked', 12, ['projector', 'whiteboard'], true),
];

const ids = (rooms: Room[], attendees: number, equipment: string[]) =>
  filterRooms(rooms, attendees, equipment).map((m) => m.room.id);

describe('F1 — capacity >= attendees', () => {
  test('F1: exact capacity is enough (capacity 8, 8 attendees)', () => {
    expect(ids([room('small', 8, [])], 8, [])).toEqual(['small']);
  });

  test('F1: insufficient capacity is excluded (capacity 8, 9 attendees)', () => {
    expect(ids([room('small', 8, [])], 9, [])).toEqual([]);
  });
});

describe('F2 — room has ALL selected equipment', () => {
  test('F2: room with a superset of the selection matches', () => {
    expect(ids(ROOMS, 1, ['projector', 'whiteboard'])).toEqual(['big', 'locked']);
  });

  test('F2: room with only part of the selection is excluded', () => {
    // studio has projector but no whiteboard
    expect(ids(ROOMS, 1, ['projector', 'whiteboard'])).not.toContain('studio');
  });

  test('F2: empty selection matches every room that passes F1', () => {
    expect(ids(ROOMS, 10, [])).toEqual(['big', 'studio', 'locked']);
  });
});

describe('F3 — blocked room is listed but never selectable', () => {
  test('F3: blocked room has selectable = false, others true', () => {
    const matches = filterRooms(ROOMS, 1, ['projector']);
    expect(matches.map((m) => [m.room.id, m.selectable])).toEqual([
      ['big', true],
      ['studio', true],
      ['locked', false],
    ]);
  });

  test('F3: only a blocked room matches → no selectable room', () => {
    // among small/studio/locked only "locked" has whiteboard AND seats 12
    const matches = filterRooms([ROOMS[0], ROOMS[2], ROOMS[3]], 12, ['whiteboard']);
    expect(matches.map((m) => m.room.id)).toEqual(['locked']);
    expect(hasSelectableRoom(matches)).toBe(false);
  });
});

describe('F4 — empty result (data case)', () => {
  test('F4: no room has enough capacity → empty array', () => {
    expect(filterRooms(ROOMS, 50, [])).toEqual([]);
    expect(hasSelectableRoom(filterRooms(ROOMS, 50, []))).toBe(false);
  });

  test('F4: no room has the equipment combination → empty array', () => {
    expect(filterRooms(ROOMS, 1, ['computers', 'sound-system'])).toEqual([]);
  });
});

describe('Immutability and catalog', () => {
  test('filterRooms does not mutate rooms or the equipment selection', () => {
    const rooms = structuredClone(ROOMS);
    const selection = ['projector'];
    filterRooms(rooms, 5, selection);
    expect(rooms).toEqual(ROOMS);
    expect(selection).toEqual(['projector']);
  });

  test('catalog: at least 4 rooms, unique ids, one blocked, each with equipment and own bookings', () => {
    expect(SAMPLE_ROOMS.length).toBeGreaterThanOrEqual(4);
    expect(new Set(SAMPLE_ROOMS.map((r) => r.id)).size).toBe(SAMPLE_ROOMS.length);
    expect(SAMPLE_ROOMS.some((r) => r.blocked)).toBe(true);
    for (const r of SAMPLE_ROOMS) {
      expect(Array.isArray(r.equipment)).toBe(true);
      expect(Array.isArray(r.bookings)).toBe(true);
    }
  });
});
