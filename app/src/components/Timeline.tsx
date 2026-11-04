import { MAX_DAY } from '@/lib/time';
import { minutesToHHMM } from '@/lib/time';
import type { Room } from '@/types';

interface Props {
  room: Room | null;
  candidateStart: number | null;
  candidateEnd: number | null;
  available: boolean | null;
}

const HOUR_PX = 44;
const TOTAL_WIDTH = (MAX_DAY / 60) * HOUR_PX;

export function Timeline({ room, candidateStart, candidateEnd, available }: Props) {
  const hours = Array.from({ length: 25 }, (_, i) => i);

  const candidateLeft = candidateStart !== null ? (candidateStart / MAX_DAY) * TOTAL_WIDTH : 0;
  const candidateWidth =
    candidateStart !== null && candidateEnd !== null
      ? ((candidateEnd - candidateStart) / MAX_DAY) * TOTAL_WIDTH
      : 0;
  const showCandidate = candidateStart !== null && candidateEnd !== null && candidateEnd > candidateStart;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Today's Schedule</h3>
        <div className="flex items-center gap-2">
          {room && <span className="truncate text-xs text-slate-400">{room.name}</span>}
          <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 sm:hidden">
            <span>Swipe</span>
            <span aria-hidden>→</span>
          </span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
        <div style={{ width: TOTAL_WIDTH }} className="relative">
          <div className="relative h-20">
            {/* hour grid lines */}
            {hours.map((h) => (
              <div
                key={h}
                className="absolute top-0 bottom-0 border-l border-slate-100"
                style={{ left: (h * 60 / MAX_DAY) * TOTAL_WIDTH }}
              />
            ))}

            {/* existing bookings */}
            {room?.bookings.map((b, i) => (
              <div
                key={i}
                className="absolute top-2 bottom-2 rounded-md bg-slate-300/80 px-1.5 flex items-center overflow-hidden"
                style={{
                  left: (b.start / MAX_DAY) * TOTAL_WIDTH,
                  width: ((b.end - b.start) / MAX_DAY) * TOTAL_WIDTH,
                }}
                title={`${b.label} (${minutesToHHMM(b.start)}–${minutesToHHMM(b.end)})`}
              >
                <span className="truncate text-[10px] font-medium text-slate-700">
                  {minutesToHHMM(b.start)}–{minutesToHHMM(b.end)}
                </span>
              </div>
            ))}

            {/* candidate interval */}
            {showCandidate && (
              <div
                className={[
                  'absolute top-2 bottom-2 rounded-md border-2 flex items-center justify-center',
                  available === true
                    ? 'border-emerald-400 bg-emerald-200/70'
                    : available === false
                      ? 'border-red-400 bg-red-200/70'
                      : 'border-amber-400 bg-amber-200/70',
                ].join(' ')}
                style={{ left: candidateLeft, width: candidateWidth }}
              >
                <span className="text-[10px] font-bold text-slate-800">
                  {candidateStart !== null && candidateEnd !== null && `${minutesToHHMM(candidateStart)}–${minutesToHHMM(candidateEnd)}`}
                </span>
              </div>
            )}
          </div>

          {/* hour labels */}
          <div className="relative h-5" style={{ width: TOTAL_WIDTH }}>
            {hours.filter((h) => h % 2 === 0).map((h) => (
              <span
                key={h}
                className="absolute -translate-x-1/2 text-[10px] text-slate-400"
                style={{ left: (h * 60 / MAX_DAY) * TOTAL_WIDTH }}
              >
                {minutesToHHMM(h * 60)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-slate-300" /> Existing booking
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border-2 border-emerald-400 bg-emerald-200/70" /> Candidate (available)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border-2 border-red-400 bg-red-200/70" /> Candidate (blocked)
        </span>
      </div>
    </div>
  );
}
