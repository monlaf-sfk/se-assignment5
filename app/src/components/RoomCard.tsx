import { Lock, Users, MapPin, CheckCircle2 } from 'lucide-react';
import type { Room } from '@/types';

interface Props {
  room: Room;
  selected: boolean;
  disabled: boolean;
  onSelect: (id: string) => void;
}

export function RoomCard({ room, selected, disabled, onSelect }: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(room.id)}
      className={[
        'group relative w-full rounded-2xl border p-4 text-left transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400',
        selected
          ? 'border-sky-500 bg-sky-50 shadow-md ring-1 ring-sky-200'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">{room.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {room.building}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> {room.capacity} seats
            </span>
          </div>
        </div>
        {room.blocked ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-[11px] font-medium text-red-700">
            <Lock className="h-3 w-3" /> Blocked
          </span>
        ) : (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-medium text-emerald-700">
            <CheckCircle2 className="h-3 w-3" /> {room.bookings.length} booked
          </span>
        )}
      </div>
      {selected && (
        <span className="absolute right-3 top-3 text-sky-500">
          <CheckCircle2 className="h-4 w-4" />
        </span>
      )}
    </button>
  );
}
