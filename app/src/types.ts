export interface Booking {
  start: number;
  end: number;
  label: string;
}

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  blockReason?: string;
  bookings: Booking[];
}

export interface AvailabilityResult {
  available: boolean;
  reason: string;
  conflict?: Booking;
}
