import { describe, it, expect } from 'vitest';
import { checkAvailability } from './availability';
import type { Room } from '@/types';

const CURRENT_TIME = 540;

function makeRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: 'test-room',
    name: 'Test Room',
    building: 'Test Building',
    capacity: 10,
    equipment: [],
    blocked: false,
    bookings: [{ start: 600, end: 660, label: 'Sample' }],
    ...overrides,
  };
}

function check(start: number, end: number, roomOverrides: Partial<Room> = {}) {
  return checkAvailability({
    room: makeRoom(roomOverrides),
    start,
    end,
    currentTime: CURRENT_TIME,
  });
}

describe('checkAvailability', () => {
  describe('AC1 — valid interval bounds and start after currentTime', () => {
    // T01: touching endpoint after booking → available (also AC4)
    it('T01: 660–720 returns true (touches booking end, after currentTime)', () => {
      const r = check(660, 720);
      expect(r.available).toBe(true);
      expect(r.conflict).toBeUndefined();
    });

    // T02: start equals currentTime → rejected (start must be strictly after)
    it('T02: 540–570 returns false (start not strictly after currentTime)', () => {
      const r = check(540, 570);
      expect(r.available).toBe(false);
    });

    // T03: start === end → rejected
    it('T03: 720–720 returns false (start equals end)', () => {
      const r = check(720, 720);
      expect(r.available).toBe(false);
    });

    // T04: start > end → rejected
    it('T04: 750–720 returns false (start after end)', () => {
      const r = check(750, 720);
      expect(r.available).toBe(false);
    });

    // T05: end > 1440 → rejected
    it('T05: 1380–1441 returns false (end exceeds 1440)', () => {
      const r = check(1380, 1441);
      expect(r.available).toBe(false);
    });
  });

  describe('AC2 — max booking duration 120 minutes', () => {
    // T06: exactly 120 min → allowed
    it('T06: 720–840 returns true (exactly 120 min)', () => {
      const r = check(720, 840);
      expect(r.available).toBe(true);
    });

    // T07: 121 min → rejected
    it('T07: 720–841 returns false (121 min exceeds limit)', () => {
      const r = check(720, 841);
      expect(r.available).toBe(false);
    });
  });

  describe('AC3 — blocked room rejected', () => {
    // T13: blocked room → rejected even with a valid free slot
    it('T13: 660–720 with blocked=true returns false', () => {
      const r = check(660, 720, { blocked: true, blockReason: 'Maintenance' });
      expect(r.available).toBe(false);
    });
  });

  describe('AC4 — overlap detection, touching endpoints allowed', () => {
    // T08: ends exactly at booking start → touching, allowed
    it('T08: 570–600 returns true (ends at booking start)', () => {
      const r = check(570, 600);
      expect(r.available).toBe(true);
    });

    // T09: starts at booking end → touching, allowed (duplicate of T01 shape)
    it('T01/T09 family: 660–720 returns true (starts at booking end)', () => {
      const r = check(660, 720);
      expect(r.available).toBe(true);
    });

    // T10: fully contains the booking → overlap
    it('T10: 570–690 returns false (contains the booking)', () => {
      const r = check(570, 690);
      expect(r.available).toBe(false);
      expect(r.conflict).toBeDefined();
      expect(r.conflict?.label).toBe('Sample');
    });

    // T11: partial overlap at start → rejected
    it('T11: 615–645 returns false (partial overlap)', () => {
      const r = check(615, 645);
      expect(r.available).toBe(false);
      expect(r.conflict).toBeDefined();
    });

    // T12: exact match of booking → rejected
    it('T12: 600–660 returns false (exact booking interval)', () => {
      const r = check(600, 660);
      expect(r.available).toBe(false);
      expect(r.conflict).toBeDefined();
    });

    // T14: no bookings at all → allowed
    it('T14: 630–690 with empty bookings returns true', () => {
      const r = check(630, 690, { bookings: [] });
      expect(r.available).toBe(true);
    });
  });

  describe('AC5 — check must not mutate booking data', () => {
    it('AC5: calling checkAvailability does not change the room bookings', () => {
      const room = makeRoom();
      const snapshot = room.bookings.map((b) => ({ ...b }));
      checkAvailability({ room, start: 660, end: 720, currentTime: CURRENT_TIME });
      expect(room.bookings).toEqual(snapshot);
      expect(room.bookings.length).toBe(1);
    });
  });
});
