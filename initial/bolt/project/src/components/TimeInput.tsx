interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

export function TimeInput({ label, value, onChange, error }: Props) {
  return (
    <div className="flex-1">
      <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          'w-full rounded-lg border bg-white px-3 py-2.5 text-base text-slate-800 transition sm:text-sm',
          'focus:outline-none focus:ring-2 focus:ring-sky-400',
          error ? 'border-red-300' : 'border-slate-200',
        ].join(' ')}
      />
    </div>
  );
}
