import { CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';
import type { AvailabilityResult } from '@/types';

interface Props {
  result: AvailabilityResult | null;
  duration: number | null;
}

export function ResultBanner({ result, duration }: Props) {
  if (!result) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
        <Clock className="h-5 w-5 text-slate-400" />
        <p className="text-sm text-slate-500">
          Select a room and enter a time range to check availability.
        </p>
      </div>
    );
  }

  if (result.available) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <div>
          <p className="text-sm font-semibold text-emerald-800">Available</p>
          <p className="mt-0.5 text-sm text-emerald-700">
            {result.reason}
            {duration !== null && ` (${duration} min)`}
          </p>
        </div>
      </div>
    );
  }

  const hasConflict = !!result.conflict;
  return (
    <div
      className={[
        'flex items-start gap-3 rounded-2xl border p-4',
        hasConflict ? 'border-amber-200 bg-amber-50' : 'border-red-200 bg-red-50',
      ].join(' ')}
    >
      {hasConflict ? (
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
      ) : (
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
      )}
      <div>
        <p className={['text-sm font-semibold', hasConflict ? 'text-amber-800' : 'text-red-800'].join(' ')}>
          Unavailable
        </p>
        <p className={['mt-0.5 text-sm', hasConflict ? 'text-amber-700' : 'text-red-700'].join(' ')}>
          {result.reason}
        </p>
      </div>
    </div>
  );
}
