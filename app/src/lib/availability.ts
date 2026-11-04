import type { AvailabilityResult, Room } from '@/types';
import { durationOf, formatRange, MAX_BOOKING_MINUTES, MAX_DAY, MIN_DAY, minutesToHHMM } from './time';

/** AC2 — the only place that decides whether a duration is too long. Exactly 120 is allowed. */
export function exceedsMaxDuration(duration: number): boolean {
  return duration > MAX_BOOKING_MINUTES;
}

export interface CheckParams {
  room: Room;
  start: number;
  end: number;
  currentTime: number;
}

export function checkAvailability({ room, start, end, currentTime }: CheckParams): AvailabilityResult {
  if (start < MIN_DAY || end > MAX_DAY) {
    return { available: false, reason: 'Times must be within the same day (00:00–24:00).' };
  }

  const duration = durationOf(start, end); // null exactly when start >= end
  if (duration === null) {
    return { available: false, reason: 'Start time must be earlier than end time.' };
  }

  if (start <= currentTime) {
    return {
      available: false,
      reason: `Start time must be after the current time (${minutesToHHMM(currentTime)}).`,
    };
  }

  if (exceedsMaxDuration(duration)) {
    return {
      available: false,
      reason: `Bookings cannot exceed ${MAX_BOOKING_MINUTES} minutes. Your request is ${duration} minutes.`,
    };
  }

  if (room.blocked) {
    return {
      available: false,
      reason: room.blockReason
        ? `This room is blocked: ${room.blockReason}.`
        : 'This room is currently blocked and cannot be booked.',
    };
  }

  for (const booking of room.bookings) {
    const overlaps = start < booking.end && end > booking.start;
    if (overlaps) {
      return {
        available: false,
        reason: `Overlaps an existing booking (${booking.label}, ${formatRange(booking.start, booking.end)}). Touching endpoints are allowed.`,
        conflict: booking,
      };
    }
  }

  return { available: true, reason: 'This time slot is available for booking.', duration };
}
