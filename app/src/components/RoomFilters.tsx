import { Users } from 'lucide-react';

interface Props {
  attendees: string;
  attendeesError?: string;
  onAttendeesChange: (value: string) => void;
  options: readonly string[];
  selected: readonly string[];
  onToggle: (item: string) => void;
}

export function RoomFilters({ attendees, attendeesError, onAttendeesChange, options, selected, onToggle }: Props) {
  return (
    <div className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <label htmlFor="attendees" className="mb-1 block text-xs font-medium text-slate-600">
        Attendees
      </label>
      <div className="relative">
        <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          id="attendees"
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          value={attendees}
          onChange={(e) => onAttendeesChange(e.target.value)}
          className={[
            'w-full rounded-lg border bg-white py-2.5 pl-9 pr-3 text-base text-slate-800 sm:text-sm',
            'focus:outline-none focus:ring-2 focus:ring-sky-400',
            attendeesError ? 'border-red-300' : 'border-slate-200',
          ].join(' ')}
        />
      </div>
      {attendeesError && <p className="mt-1 text-xs text-red-600">{attendeesError}</p>}

      <fieldset className="mt-3">
        <legend className="mb-1.5 text-xs font-medium text-slate-600">Required equipment</legend>
        <div className="flex flex-wrap gap-2">
          {options.map((item) => {
            const checked = selected.includes(item);
            return (
              <label
                key={item}
                className={[
                  'inline-flex cursor-pointer select-none items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition',
                  checked ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                ].join(' ')}
              >
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 accent-sky-600"
                  checked={checked}
                  onChange={() => onToggle(item)}
                />
                {item}
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
