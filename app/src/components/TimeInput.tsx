import { useId } from 'react';

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

export function TimeInput({ label, value, onChange, error }: Props) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="flex-1">
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </label>
      <input
        id={id}
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={[
          'w-full rounded-lg border bg-white px-3 py-2.5 text-base text-slate-800 transition sm:text-sm',
          'focus:outline-none focus:ring-2 focus:ring-sky-400',
          error ? 'border-red-300' : 'border-slate-200',
        ].join(' ')}
      />
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
