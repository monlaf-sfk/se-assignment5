import { describe, expect, test } from 'vitest';
import { SAMPLE_ROOMS } from '@/data';
import { findSelectableRoom, matchRooms } from './selection';

describe('matchRooms', () => {
  test('invalid attendees input yields no matches', () => {
    for (const bad of ['', '0', '-3', '2.5', 'abc']) {
      expect(matchRooms(SAMPLE_ROOMS, bad, [])).toEqual([]);
    }
  });

  test('valid input delegates to filterRooms (capacity + all equipment)', () => {
    const ids = matchRooms(SAMPLE_ROOMS, '10', ['projector']).map((m) => m.room.id);
    expect(ids).toEqual(['eng-110', 'arts-05', 'sci-340']);
  });
});

describe('findSelectableRoom', () => {
  const matches = matchRooms(SAMPLE_ROOMS, '10', ['projector']);

  test('returns the selected room while it is visible and selectable', () => {
    expect(findSelectableRoom(matches, 'eng-110')?.id).toBe('eng-110');
  });

  test('blocked room is never returned (F3)', () => {
    expect(findSelectableRoom(matches, 'sci-340')).toBeNull();
  });

  test('room hidden by filters is dropped (F5)', () => {
    expect(findSelectableRoom(matches, 'lib-201')).toBeNull();
  });

  test('no selection stays no selection', () => {
    expect(findSelectableRoom(matches, null)).toBeNull();
  });
});
