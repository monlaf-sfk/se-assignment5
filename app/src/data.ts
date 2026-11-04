import type { Room } from '@/types';

export const SAMPLE_ROOMS: Room[] = [
  {
    id: 'lib-201',
    name: 'Library Study Room 201',
    building: 'Main Library',
    capacity: 8,
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
    blocked: true,
    blockReason: 'Under maintenance until tomorrow',
    bookings: [
      { start: 660, end: 720, label: 'Reserved (maintenance)' },
    ],
  },
];
