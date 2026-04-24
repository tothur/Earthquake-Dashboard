import { AlertTriangle, Clock3, PanelRightOpen, SignalHigh, Waves } from 'lucide-react';
import type { DashboardCopy } from '../i18n';
import type { Earthquake } from '../types';
import { getMostRecent, getStrongest } from '../utils/earthquakes';
import { formatDateTime, formatMagnitude, formatNumber, formatRelativeTime } from '../utils/format';

interface TsunamiStatusProps {
  quakes: Earthquake[];
  feedLabel: string;
  copy: DashboardCopy;
  isLoading: boolean;
  onQuakeSelect: (quake: Earthquake) => void;
}

export function TsunamiStatus({ quakes, feedLabel, copy, isLoading, onQuakeSelect }: TsunamiStatusProps) {
  const flaggedQuakes = quakes.filter((quake) => quake.tsunami);
  const strongest = getStrongest(flaggedQuakes);
  const latest = getMostRecent(flaggedQuakes);
  const hasFlaggedEvents = flaggedQuakes.length > 0;
  const countLabel = formatNumber(flaggedQuakes.length, copy.locale);

  if (isLoading) {
    return (
      <section className="rounded-[8px] border border-white/10 bg-white/[0.045] p-4 shadow-panel">
        <div className="h-4 w-48 animate-pulse rounded bg-white/10" />
        <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-white/10" />
      </section>
    );
  }

  return (
    <section
      className={`rounded-[8px] border p-4 shadow-panel ${
        hasFlaggedEvents
          ? 'border-signal-orange/30 bg-signal-orange/10'
          : 'border-white/10 bg-white/[0.045]'
      }`}
      role="status"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div
            className={`inline-flex items-center gap-2 rounded-[8px] border px-3 py-1 text-sm font-semibold ${
              hasFlaggedEvents
                ? 'border-signal-orange/30 bg-signal-orange/15 text-signal-orange'
                : 'border-signal-green/25 bg-signal-green/10 text-signal-green'
            }`}
          >
            {hasFlaggedEvents ? <AlertTriangle size={16} aria-hidden="true" /> : <Waves size={16} aria-hidden="true" />}
            {copy.tsunami.title}
          </div>
          <h2 className="mt-3 text-xl font-semibold text-white">
            {hasFlaggedEvents ? copy.tsunami.flaggedTitle(countLabel) : copy.tsunami.clearTitle}
          </h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
            {hasFlaggedEvents ? copy.tsunami.flaggedBody(feedLabel) : copy.tsunami.clearBody(feedLabel)}
          </p>
          <p className="mt-2 max-w-4xl text-xs leading-5 text-slate-500">{copy.tsunami.disclaimer}</p>
        </div>

        {hasFlaggedEvents && (
          <div className="grid gap-2 text-sm sm:grid-cols-2 lg:min-w-[360px]">
            <div className="rounded-[8px] border border-white/10 bg-ink-900/70 px-3 py-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <SignalHigh size={14} aria-hidden="true" />
                {copy.tsunami.strongest}
              </div>
              <p className="mt-1 font-semibold text-white">
                {strongest ? formatMagnitude(strongest.magnitude, copy.locale, copy.pendingMagnitude) : copy.notAvailable}
              </p>
            </div>
            <div className="rounded-[8px] border border-white/10 bg-ink-900/70 px-3 py-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Clock3 size={14} aria-hidden="true" />
                {copy.tsunami.latest}
              </div>
              <p className="mt-1 font-semibold text-white">{latest ? formatRelativeTime(latest.time, copy.locale) : copy.notAvailable}</p>
            </div>
          </div>
        )}
      </div>

      {hasFlaggedEvents && (
        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="text-sm font-semibold text-white">{copy.tsunami.reviewEvents}</p>
          <div className="mt-2 grid gap-2 lg:grid-cols-3">
            {flaggedQuakes.slice(0, 3).map((quake) => (
              <button
                key={quake.id}
                type="button"
                onClick={() => onQuakeSelect(quake)}
                className="flex min-w-0 items-start justify-between gap-3 rounded-[8px] border border-white/10 bg-ink-900/70 px-3 py-2 text-left transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-white">{quake.place}</span>
                  <span className="mt-1 block text-xs text-slate-400">{formatDateTime(quake.time, copy.locale)}</span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-signal-orange">
                  {formatMagnitude(quake.magnitude, copy.locale, copy.pendingMagnitude)}
                  <PanelRightOpen size={14} aria-hidden="true" />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
