import { useMemo, useState } from 'react';
import { Building2, Clock3, RotateCcw } from 'lucide-react';
import { EQUIPMENT_OPTIONS, SAMPLE_ROOMS } from '@/data';
import type { AvailabilityResult } from '@/types';
import { checkAvailability, exceedsMaxDuration } from '@/lib/availability';
import { hasSelectableRoom, parseAttendees } from '@/lib/filtering';
import { findSelectableRoom, matchRooms } from '@/lib/selection';
import { RoomFilters } from '@/components/RoomFilters';
import { EmptyState } from '@/components/EmptyState';
import { durationOf, hhmmToMinutes, MAX_BOOKING_MINUTES, minutesToHHMM } from '@/lib/time';
import { RoomCard } from '@/components/RoomCard';
import { Timeline } from '@/components/Timeline';
import { TimeInput } from '@/components/TimeInput';
import { ResultBanner } from '@/components/ResultBanner';

function App() {
  // Current time as minutes from midnight (fictional "now" = 10:30)
  const [currentTime] = useState(630);
  const [roomId, setRoomId] = useState<string | null>(SAMPLE_ROOMS[0].id);
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('12:00');
  const [result, setResult] = useState<AvailabilityResult | null>(null);
  const [attendees, setAttendees] = useState('1');
  const [equipment, setEquipment] = useState<string[]>([]);

  const attendeesCount = parseAttendees(attendees);
  const attendeesError = attendeesCount === null ? 'Enter a whole number of 1 or more.' : undefined;

  const matches = useMemo(() => matchRooms(SAMPLE_ROOMS, attendees, equipment), [attendees, equipment]);
  const showEmptyState = !hasSelectableRoom(matches);

  // Only a room that is visible AND selectable can be the subject of a check (F3, F5).
  const room = useMemo(() => findSelectableRoom(matches, roomId), [matches, roomId]);

  // F5: when filters hide (or block) the selected room, drop the selection and its result.
  const applyFilters = (nextAttendees: string, nextEquipment: string[]) => {
    setAttendees(nextAttendees);
    setEquipment(nextEquipment);
    if (findSelectableRoom(matchRooms(SAMPLE_ROOMS, nextAttendees, nextEquipment), roomId) === null) {
      setRoomId(null);
      setResult(null);
    }
  };
  const toggleEquipment = (item: string) =>
    applyFilters(attendees, equipment.includes(item) ? equipment.filter((e) => e !== item) : [...equipment, item]);

  const startMin = hhmmToMinutes(startTime);
  const endMin = hhmmToMinutes(endTime);

  const startError = startMin === null ? 'Enter a valid start time (HH:MM).' : undefined;
  const endError = endMin === null ? 'Enter a valid end time (HH:MM).' : undefined;

  const duration = durationOf(startMin, endMin);

  // R1 fix: a result always belongs to the current inputs.
  // Any change of room or time clears it until the user presses Check again (F5, F3).
  const selectRoom = (id: string) => {
    setRoomId(id);
    setResult(null);
  };
  const changeStart = (value: string) => {
    setStartTime(value);
    setResult(null);
  };
  const changeEnd = (value: string) => {
    setEndTime(value);
    setResult(null);
  };

  const handleCheck = () => {
    if (!room) {
      setResult({ available: false, reason: 'Select a room first.' });
      return;
    }
    if (startMin === null || endMin === null) {
      setResult({ available: false, reason: 'Enter a valid start and end time.' });
      return;
    }
    setResult(checkAvailability({ room, start: startMin, end: endMin, currentTime }));
  };

  const handleReset = () => {
    setRoomId(SAMPLE_ROOMS[0].id);
    setStartTime('11:00');
    setEndTime('12:00');
    setResult(null);
    setAttendees('1');
    setEquipment([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto max-w-5xl px-3 py-6 sm:px-6 sm:py-8 lg:py-12">
        {/* Header */}
        <header className="mb-6 flex flex-col items-start gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm sm:h-11 sm:w-11">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Smart Campus Room Checker</h1>
              <p className="text-sm text-slate-500">Check room availability before you book</p>
            </div>
          </div>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm sm:mt-0">
            <Clock3 className="h-4 w-4 text-sky-600" />
            Current time: <span className="font-semibold text-slate-800">{minutesToHHMM(currentTime)}</span>
          </div>
        </header>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-5">
          {/* Left: Room selection */}
          <section className="min-w-0 lg:col-span-2">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              1. Select a room
            </h2>
            <RoomFilters
              attendees={attendees}
              attendeesError={attendeesError}
              onAttendeesChange={(value) => applyFilters(value, equipment)}
              options={EQUIPMENT_OPTIONS}
              selected={equipment}
              onToggle={toggleEquipment}
            />
            <p className="mb-2 text-xs text-slate-500" aria-live="polite">
              {matches.length} of {SAMPLE_ROOMS.length} rooms match
            </p>
            <div className="space-y-3">
              {showEmptyState && (
                <EmptyState
                  message={
                    attendeesError
                      ? 'Enter a valid number of attendees to see rooms.'
                      : matches.length > 0
                        ? 'Only blocked rooms match. Reduce attendees or remove some equipment.'
                        : 'Reduce the number of attendees or remove some equipment.'
                  }
                />
              )}
              {matches.map(({ room: r, selectable }) => (
                <RoomCard
                  key={r.id}
                  room={r}
                  selected={r.id === roomId && selectable}
                  disabled={!selectable}
                  onSelect={selectRoom}
                />
              ))}
            </div>
          </section>

          {/* Right: Time + result */}
          <section className="min-w-0 lg:col-span-3">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              2. Enter a time range
            </h2>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <TimeInput label="Start time" value={startTime} onChange={changeStart} error={startError} />
                <TimeInput label="End time" value={endTime} onChange={changeEnd} error={endError} />
                <div className="flex gap-2 sm:flex-none">
                  <button
                    type="button"
                    onClick={handleCheck}
                    className="flex-1 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 sm:py-2"
                  >
                    Check
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 sm:py-2"
                    title="Reset"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                <span>Max booking: {MAX_BOOKING_MINUTES} min</span>
                <span>Day window: 00:00–24:00</span>
                {duration !== null && (
                  <span className={exceedsMaxDuration(duration) ? 'font-semibold text-red-600' : 'font-semibold text-slate-700'}>
                    Your duration: {duration} min
                  </span>
                )}
              </div>
            </div>

            {/* Result */}
            <div className="mt-4">
              <ResultBanner result={result} />
            </div>

            {/* Timeline */}
            <div className="mt-4">
              <Timeline
                room={room}
                candidateStart={startMin}
                candidateEnd={endMin}
                available={result?.available ?? null}
              />
            </div>
          </section>
        </div>

        <footer className="mt-8 text-center text-xs text-slate-400 sm:mt-10">
          Uses fictional sample data. No bookings are actually created.
        </footer>
      </div>
    </div>
  );
}

export default App;
