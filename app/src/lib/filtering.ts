import type { Room } from '@/types';

export interface RoomMatch {
  room: Room;
  /** F3: false for a blocked room — it is listed but can never be selected or reported available. */
  selectable: boolean;
}

/**
 * Pure room filter. Does not mutate `rooms` or `equipment`.
 * F1: room.capacity >= attendees.
 * F2: room has ALL selected equipment (empty selection matches every room).
 * F3: blocked rooms that satisfy F1/F2 stay in the list with selectable = false.
 * F4: an empty array (or no selectable match) means "no rooms match" for the UI.
 */
export function filterRooms(rooms: readonly Room[], attendees: number, equipment: readonly string[]): RoomMatch[] {
  return rooms
    .filter((room) => room.capacity >= attendees)
    .filter((room) => equipment.every((item) => room.equipment.includes(item)))
    .map((room) => ({ room, selectable: !room.blocked }));
}

/** Attendees input → whole number >= 1, or null when invalid (empty, 0, negative, fractional). */
export function parseAttendees(value: string): number | null {
  if (!/^\d+$/.test(value.trim())) return null;
  const n = Number(value);
  return n >= 1 ? n : null;
}

export function hasSelectableRoom(matches: readonly RoomMatch[]): boolean {
  return matches.some((m) => m.selectable);
}
