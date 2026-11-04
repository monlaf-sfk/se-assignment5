import type { Room } from '@/types';

// Equipment a user can require (F2). Fictional catalog.
export const EQUIPMENT_OPTIONS = ['projector', 'whiteboard', 'video-conf', 'computers', 'sound-system'] as const;

export const SAMPLE_ROOMS: Room[] = [
  {
    id: 'lib-201',
    name: 'Library Study Room 201',
    building: 'Main Library',
    capacity: 8,
    equipment: ['whiteboard'],
    blocked: false,
    bookings: [
      { start: 540, end: 600, label: 'Morning Study Group' },
      { start: 780, end: 840, label: 'Faculty Meeting' },
      { start: 960, end: 1020, label: 'Thesis Review' },
    ],
  },
  {
    id: 'eng-110',
    name: 'Engineering Lab 110',
    building: 'Tech Hall',
    capacity: 30,
    equipment: ['projector', 'whiteboard', 'computers', 'video-conf'],
    blocked: false,
    bookings: [
      { start: 600, end: 660, label: 'Robotics Setup' },
      { start: 720, end: 840, label: 'Robotics Workshop' },
      { start: 900, end: 960, label: 'Capstone Demo' },
    ],
  },
  {
    id: 'arts-05',
    name: 'Arts Studio 05',
    building: 'Creative Arts Center',
    capacity: 16,
    equipment: ['projector', 'sound-system'],
    blocked: false,
    bookings: [
      { start: 840, end: 900, label: 'Painting Class' },
    ],
  },
  {
    id: 'sci-340',
    name: 'Science Seminar Room 340',
    building: 'Science Block',
    capacity: 12,
    equipment: ['projector', 'whiteboard', 'video-conf'],
    blocked: true,
    blockReason: 'Under maintenance until tomorrow',
    bookings: [
      { start: 660, end: 720, label: 'Reserved (maintenance)' },
    ],
  },
  {
    id: 'hub-02',
    name: 'Student Hub Pod 02',
    building: 'Student Center',
    capacity: 4,
    equipment: ['whiteboard', 'video-conf'],
    blocked: false,
    bookings: [
      { start: 690, end: 750, label: 'Tutoring Session' },
    ],
  },
];
