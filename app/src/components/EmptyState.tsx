import { SearchX } from 'lucide-react';

interface Props {
  message: string;
}

/** F4: shown when no selectable room matches the filters. */
export function EmptyState({ message }: Props) {
  return (
    <div role="status" className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center">
      <SearchX className="mx-auto h-6 w-6 text-slate-400" />
      <p className="mt-2 text-sm font-semibold text-slate-700">No rooms match your requirements</p>
      <p className="mt-1 text-sm text-slate-500">{message}</p>
    </div>
  );
}
