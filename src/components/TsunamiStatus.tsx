import { AlertTriangle, Clock3, ExternalLink, PanelRightOpen, RadioTower, SignalHigh, Waves } from 'lucide-react';
import type { DashboardCopy } from '../i18n';
import type { Earthquake, TsunamiAlert, TsunamiAlertLevel } from '../types';
import { formatDateTime, formatMagnitude, formatNumber } from '../utils/format';
import { TSUNAMI_WARNING_CENTER_URL } from '../utils/tsunami';

interface TsunamiStatusProps {
  quakes: Earthquake[];
  alerts: TsunamiAlert[];
  alertStatus: 'idle' | 'loading' | 'success' | 'error';
  alertUpdatedAt: number | null;
  alertError: string | null;
  feedLabel: string;
  copy: DashboardCopy;
  isLoading: boolean;
  onQuakeSelect: (quake: Earthquake) => void;
}

function alertTone(level: TsunamiAlertLevel): string {
  if (level === 'warning') {
    return 'border-signal-red/30 bg-signal-red/10 text-signal-red';
  }

  if (level === 'advisory') {
    return 'border-signal-orange/30 bg-signal-orange/10 text-signal-orange';
  }

  if (level === 'watch') {
    return 'border-signal-amber/30 bg-signal-amber/10 text-signal-amber';
  }

  return 'border-signal-green/25 bg-signal-green/10 text-signal-green';
}

export function TsunamiStatus({
  quakes,
  alerts,
  alertStatus,
  alertUpdatedAt,
  alertError,
  feedLabel,
  copy,
  isLoading,
  onQuakeSelect,
}: TsunamiStatusProps) {
  const flaggedQuakes = quakes.filter((quake) => quake.tsunami);
  const hasFlaggedEvents = flaggedQuakes.length > 0;
  const hasOfficialAlerts = alerts.length > 0;
  const countLabel = formatNumber(flaggedQuakes.length, copy.locale);
  const officialAlertCountLabel = formatNumber(alerts.length, copy.locale);
  const updatedAtLabel = alertUpdatedAt ? formatDateTime(alertUpdatedAt, copy.locale) : copy.notAvailable;

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
        hasOfficialAlerts || hasFlaggedEvents
          ? 'border-signal-orange/30 bg-signal-orange/10'
          : 'border-white/10 bg-white/[0.045]'
      }`}
      role="status"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div
            className={`inline-flex items-center gap-2 rounded-[8px] border px-3 py-1 text-sm font-semibold ${
              hasOfficialAlerts || hasFlaggedEvents
                ? 'border-signal-orange/30 bg-signal-orange/15 text-signal-orange'
                : 'border-signal-green/25 bg-signal-green/10 text-signal-green'
            }`}
          >
            {hasOfficialAlerts || hasFlaggedEvents ? (
              <AlertTriangle size={16} aria-hidden="true" />
            ) : (
              <Waves size={16} aria-hidden="true" />
            )}
            {copy.tsunami.title}
          </div>
          <h2 className="mt-3 text-xl font-semibold text-white">
            {hasOfficialAlerts
              ? copy.tsunami.officialAlertTitle(officialAlertCountLabel)
              : hasFlaggedEvents
                ? copy.tsunami.flaggedTitle(countLabel)
                : copy.tsunami.clearTitle}
          </h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
            {hasOfficialAlerts
              ? copy.tsunami.officialAlertBody
              : hasFlaggedEvents
                ? copy.tsunami.flaggedBody(feedLabel)
                : copy.tsunami.clearBody(feedLabel)}
          </p>
          <p className="mt-2 max-w-4xl text-xs leading-5 text-slate-500">{copy.tsunami.disclaimer}</p>
        </div>

        {(hasOfficialAlerts || hasFlaggedEvents) && (
          <div className="grid gap-2 text-sm sm:grid-cols-2 lg:min-w-[360px]">
            <div className="rounded-[8px] border border-white/10 bg-ink-900/70 px-3 py-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <RadioTower size={14} aria-hidden="true" />
                {copy.tsunami.officialAlerts}
              </div>
              <p className="mt-1 font-semibold text-white">{officialAlertCountLabel}</p>
            </div>
            <div className="rounded-[8px] border border-white/10 bg-ink-900/70 px-3 py-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Clock3 size={14} aria-hidden="true" />
                {copy.tsunami.alertFeedUpdated}
              </div>
              <p className="mt-1 font-semibold text-white">{updatedAtLabel}</p>
            </div>
          </div>
        )}
      </div>

      {alertStatus === 'error' && (
        <div className="mt-4 rounded-[8px] border border-signal-amber/30 bg-signal-amber/10 px-3 py-2 text-sm text-slate-300">
          <span className="font-semibold text-white">{copy.tsunami.alertFeedUnavailable}</span>{' '}
          {alertError ?? copy.tsunami.alertFeedFallback}
        </div>
      )}

      {alertStatus === 'loading' && alerts.length === 0 && (
        <div className="mt-4 text-sm text-slate-400">{copy.tsunami.alertFeedLoading}</div>
      )}

      {hasOfficialAlerts && (
        <div className="mt-4 border-t border-white/10 pt-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-white">{copy.tsunami.officialAlertList}</p>
            <a
              href={TSUNAMI_WARNING_CENTER_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-signal-green transition hover:text-white"
            >
              {copy.tsunami.warningCenter}
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>
          <div className="mt-3 grid gap-2 lg:grid-cols-2">
            {alerts.slice(0, 4).map((alert) => (
              <a
                key={alert.id}
                href={alert.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-[8px] border border-white/10 bg-ink-900/70 px-3 py-3 text-left transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                <span className={`inline-flex rounded-[8px] border px-2 py-0.5 text-xs font-bold ${alertTone(alert.level)}`}>
                  {alert.event}
                </span>
                <span className="mt-2 block text-sm font-semibold leading-5 text-white">{alert.headline}</span>
                <span className="mt-2 block max-h-10 overflow-hidden text-xs leading-5 text-slate-400">{alert.area}</span>
                <span className="mt-2 block text-xs text-slate-500">
                  {copy.tsunami.expires}: {alert.expires ? formatDateTime(Date.parse(alert.expires), copy.locale) : copy.notAvailable}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {hasFlaggedEvents && (
        <div className="mt-4 border-t border-white/10 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-white">{copy.tsunami.reviewEvents}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <SignalHigh size={13} aria-hidden="true" />
              {copy.tsunami.usgsFlagSummary(countLabel)}
            </div>
          </div>
          <div className="mt-3 grid gap-2 lg:grid-cols-3">
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
