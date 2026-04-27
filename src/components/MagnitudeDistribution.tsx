import { BarChart3, SignalHigh } from 'lucide-react';
import type { DashboardCopy } from '../i18n';
import type { Earthquake } from '../types';
import { magnitudeTone } from '../utils/earthquakes';
import { formatNumber } from '../utils/format';

interface MagnitudeDistributionProps {
  quakes: Earthquake[];
  copy: DashboardCopy;
  isLoading: boolean;
}

interface MagnitudeBin {
  id: keyof DashboardCopy['distribution']['bins'];
  min: number;
  max: number;
  count: number;
}

const binRanges: Array<Omit<MagnitudeBin, 'count'>> = [
  { id: 'minor', min: Number.NEGATIVE_INFINITY, max: 4 },
  { id: 'light', min: 4, max: 5 },
  { id: 'moderate', min: 5, max: 6 },
  { id: 'strong', min: 6, max: 7 },
  { id: 'major', min: 7, max: Number.POSITIVE_INFINITY },
];

function buildMagnitudeBins(quakes: Earthquake[]): { bins: MagnitudeBin[]; pendingCount: number } {
  const bins = binRanges.map((bin) => ({ ...bin, count: 0 }));
  let pendingCount = 0;

  quakes.forEach((quake) => {
    if (quake.magnitude === null) {
      pendingCount += 1;
      return;
    }

    const bin = bins.find((candidate) => quake.magnitude !== null && quake.magnitude >= candidate.min && quake.magnitude < candidate.max);
    if (bin) {
      bin.count += 1;
    }
  });

  return { bins, pendingCount };
}

export function MagnitudeDistribution({ quakes, copy, isLoading }: MagnitudeDistributionProps) {
  const { bins, pendingCount } = buildMagnitudeBins(quakes);
  const totalWithMagnitude = bins.reduce((total, bin) => total + bin.count, 0);
  const maxCount = Math.max(...bins.map((bin) => bin.count), 0);
  const mostPopulated = bins.reduce<MagnitudeBin | null>((largest, bin) => {
    if (!largest || bin.count > largest.count) {
      return bin;
    }

    return largest;
  }, null);

  return (
    <section className="surface-refined overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.045] shadow-panel">
      <div className="border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <BarChart3 size={18} className="text-signal-green" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-white">{copy.distribution.title}</h2>
        </div>
        <p className="mt-1 text-sm text-slate-400">{copy.distribution.subtitle}</p>
      </div>

      <div className="px-4 py-4">
        <div className="grid gap-2 text-xs text-slate-300 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          <div className="rounded-[8px] border border-white/10 bg-ink-900/70 px-3 py-2">
            <div className="flex items-center gap-2 font-semibold text-slate-400">
              <SignalHigh size={14} aria-hidden="true" />
              {copy.distribution.total}
            </div>
            <p className="font-numeric mt-1 font-semibold text-white">{formatNumber(totalWithMagnitude, copy.locale)}</p>
          </div>
          <div className="rounded-[8px] border border-white/10 bg-ink-900/70 px-3 py-2">
            <div className="font-semibold text-slate-400">{copy.distribution.strongestBin}</div>
            <p className="mt-1 font-semibold text-white">
              {mostPopulated && mostPopulated.count > 0
                ? copy.distribution.bins[mostPopulated.id]
                : copy.notAvailable}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {bins.map((bin) => {
            const tone = magnitudeTone(bin.min === Number.NEGATIVE_INFINITY ? 0 : bin.min);
            const width = maxCount === 0 ? 0 : Math.max(5, (bin.count / maxCount) * 100);
            const countLabel = formatNumber(bin.count, copy.locale);

            return (
              <div key={bin.id}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-slate-300">{copy.distribution.bins[bin.id]}</span>
                  <span className="font-numeric font-semibold text-white">{countLabel}</span>
                </div>
                <div className="mt-1 h-3 overflow-hidden rounded-full border border-white/10 bg-ink-900/80">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${width}%`, backgroundColor: tone.color }}
                    title={copy.distribution.eventCount(countLabel)}
                    aria-label={`${copy.distribution.bins[bin.id]}: ${copy.distribution.eventCount(countLabel)}`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {pendingCount > 0 && (
          <div className="mt-4 rounded-[8px] border border-white/10 bg-ink-900/70 px-3 py-2 text-sm text-slate-400">
            {copy.distribution.pending}:{' '}
            <span className="font-numeric font-semibold text-white">{formatNumber(pendingCount, copy.locale)}</span>
          </div>
        )}

        {!isLoading && quakes.length === 0 && (
          <p className="mt-4 rounded-[8px] border border-white/10 bg-ink-900/70 px-3 py-2 text-sm text-slate-400">
            {copy.distribution.empty}
          </p>
        )}
      </div>
    </section>
  );
}
