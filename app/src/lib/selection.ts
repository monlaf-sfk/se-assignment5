import type { Room } from '@/types';
import { filterRooms, parseAttendees, type RoomMatch } from './filtering';

/**
 * Single place that turns raw filter inputs into room matches.
 * Invalid attendees input (empty, 0, fractional) yields no matches.
 */
export function matchRooms(rooms: readonly Room[], attendeesInput: string, equipment: readonly string[]): RoomMatch[] {
  const count = parseAttendees(attendeesInput);
  return count === null ? [] : filterRooms(rooms, count, equipment);
}

/**
 * F3/F5: the selected room only counts while it is visible AND selectable.
 * Returns the room, or null when the selection must be dropped.
 */
export function findSelectableRoom(matches: readonly RoomMatch[], roomId: string | null): Room | null {
  if (roomId === null) return null;
  return matches.find((m) => m.selectable && m.room.id === roomId)?.room ?? null;
}
