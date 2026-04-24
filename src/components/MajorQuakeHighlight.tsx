import { AlertTriangle, ExternalLink, RadioTower, Waves } from 'lucide-react';
import type { Earthquake } from '../types';
import { formatDateTime, formatDepth, formatMagnitude, formatRelativeTime } from '../utils/format';
import { magnitudeTone } from '../utils/earthquakes';

interface MajorQuakeHighlightProps {
  quake: Earthquake | null;
  feedLabel: string;
  magnitudeThreshold: number;
  isLoading: boolean;
}

export function MajorQuakeHighlight({ quake, feedLabel, magnitudeThreshold, isLoading }: MajorQuakeHighlightProps) {
  const thresholdLabel = `M ${magnitudeThreshold.toFixed(1)}+`;

  if (isLoading) {
    return (
      <section className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5 shadow-panel">
        <div className="h-4 w-44 animate-pulse rounded bg-white/10" />
        <div className="mt-5 grid gap-4 md:grid-cols-[160px_minmax(0,1fr)]">
          <div className="h-28 animate-pulse rounded-[8px] bg-white/10" />
          <div className="space-y-3">
            <div className="h-7 w-3/4 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
          </div>
        </div>
      </section>
    );
  }

  if (!quake) {
    return (
      <section className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5 shadow-panel">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-[8px] border border-signal-green/25 bg-signal-green/10 px-3 py-1 text-sm font-semibold text-signal-green">
              <RadioTower size={16} aria-hidden="true" />
              Major earthquake watch
            </div>
            <h2 className="mt-4 text-xl font-semibold text-white">
              No {thresholdLabel} earthquake is currently listed.
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              The selected USGS feed for {feedLabel.toLocaleLowerCase()} does not currently include an earthquake at
              or above the active monitoring threshold.
            </p>
          </div>
          <div className="rounded-[8px] border border-white/10 bg-ink-900/70 px-4 py-3 text-sm text-slate-300">
            Monitoring threshold: <span className="font-semibold text-white">{thresholdLabel}</span>
          </div>
        </div>
      </section>
    );
  }

  const tone = magnitudeTone(quake.magnitude);

  return (
    <section className="rounded-[8px] border border-signal-amber/25 bg-[linear-gradient(135deg,rgba(246,182,95,0.16),rgba(184,108,255,0.10),rgba(255,255,255,0.045))] p-5 shadow-glow">
      <div className="flex items-center gap-2 text-sm font-semibold text-signal-amber">
        <AlertTriangle size={17} aria-hidden="true" />
        Largest {thresholdLabel} event in {feedLabel.toLocaleLowerCase()}
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-[170px_minmax(0,1fr)] md:items-center">
        <div className="rounded-[8px] border border-white/10 bg-ink-950/70 p-4 text-center">
          <p className="text-sm font-medium text-slate-400">{tone.label}</p>
          <p className="mt-2 text-5xl font-semibold text-white">{formatMagnitude(quake.magnitude)}</p>
          <p className="mt-2 text-sm text-slate-400">{quake.magnitudeType ?? 'USGS magnitude'}</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold leading-tight text-white md:text-3xl">{quake.place}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-[8px] border border-white/10 bg-ink-900/70 px-3 py-1 text-sm text-slate-300">
              Depth <span className="font-semibold text-white">{formatDepth(quake.depthKm)}</span>
            </span>
            <span className="rounded-[8px] border border-white/10 bg-ink-900/70 px-3 py-1 text-sm text-slate-300">
              {formatRelativeTime(quake.time)}
            </span>
            {quake.tsunami && (
              <span className="inline-flex items-center gap-1 rounded-[8px] border border-signal-orange/30 bg-signal-orange/15 px-3 py-1 text-sm font-semibold text-signal-orange">
                <Waves size={15} aria-hidden="true" />
                Tsunami flag
              </span>
            )}
            {quake.alert && (
              <span className="rounded-[8px] border border-signal-red/30 bg-signal-red/15 px-3 py-1 text-sm font-semibold text-signal-red">
                Alert {quake.alert}
              </span>
            )}
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-400">Origin time: {formatDateTime(quake.time)}</p>
            <a
              href={quake.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.08] px-3 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.13]"
            >
              USGS event
              <ExternalLink size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
