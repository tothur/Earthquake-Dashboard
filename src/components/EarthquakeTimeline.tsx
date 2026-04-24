import { useMemo } from 'react';
import { BarChart3, Clock3, SignalHigh } from 'lucide-react';
import type { DashboardCopy } from '../i18n';
import type { Earthquake, FeedId } from '../types';
import { getStrongest, magnitudeTone } from '../utils/earthquakes';
import { formatDateTime, formatMagnitude, formatNumber } from '../utils/format';

interface EarthquakeTimelineProps {
  quakes: Earthquake[];
  feedId: FeedId;
  copy: DashboardCopy;
  isLoading: boolean;
}

interface TimelineBucket {
  start: number;
  end: number;
  count: number;
  maxMagnitude: number | null;
}

const timelineWindows: Record<FeedId, { durationMs: number; bucketCount: number }> = {
  hour: { durationMs: 60 * 60 * 1000, bucketCount: 12 },
  day: { durationMs: 24 * 60 * 60 * 1000, bucketCount: 24 },
  week: { durationMs: 7 * 24 * 60 * 60 * 1000, bucketCount: 28 },
};

function formatTimelineTime(timestamp: number, feedId: FeedId, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: feedId === 'week' ? 'short' : undefined,
    day: feedId === 'week' ? 'numeric' : undefined,
    hour: 'numeric',
    minute: feedId === 'hour' ? '2-digit' : undefined,
  }).format(new Date(timestamp));
}

function buildTimelineBuckets(quakes: Earthquake[], feedId: FeedId): TimelineBucket[] {
  const { durationMs, bucketCount } = timelineWindows[feedId];
  const end = Date.now();
  const start = end - durationMs;
  const bucketDuration = durationMs / bucketCount;

  const buckets: TimelineBucket[] = Array.from({ length: bucketCount }, (_, index) => ({
    start: start + index * bucketDuration,
    end: start + (index + 1) * bucketDuration,
    count: 0,
    maxMagnitude: null,
  }));

  quakes.forEach((quake) => {
    if (quake.time < start || quake.time > end) {
      return;
    }

    const index = Math.min(bucketCount - 1, Math.floor((quake.time - start) / bucketDuration));
    const bucket = buckets[index];
    bucket.count += 1;

    if (quake.magnitude !== null && (bucket.maxMagnitude === null || quake.magnitude > bucket.maxMagnitude)) {
      bucket.maxMagnitude = quake.magnitude;
    }
  });

  return buckets;
}

export function EarthquakeTimeline({ quakes, feedId, copy, isLoading }: EarthquakeTimelineProps) {
  const buckets = useMemo(() => buildTimelineBuckets(quakes, feedId), [feedId, quakes]);
  const maxCount = Math.max(...buckets.map((bucket) => bucket.count), 0);
  const peakBucket = buckets.reduce<TimelineBucket | null>((peak, bucket) => {
    if (!peak || bucket.count > peak.count) {
      return bucket;
    }

    if (bucket.count === peak.count && (bucket.maxMagnitude ?? 0) > (peak.maxMagnitude ?? 0)) {
      return bucket;
    }

    return peak;
  }, null);
  const strongest = getStrongest(quakes);
  const hasActivity = maxCount > 0;
  const markerIndexes = [0, Math.floor((buckets.length - 1) / 2), buckets.length - 1];

  return (
    <section className="overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.045] shadow-panel">
      <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-signal-green" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-white">{copy.timeline.title}</h2>
          </div>
          <p className="mt-1 text-sm text-slate-400">{copy.timeline.subtitle}</p>
        </div>

        <div className="grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
          <div className="rounded-[8px] border border-white/10 bg-ink-900/70 px-3 py-2">
            <div className="flex items-center gap-2 font-semibold text-slate-400">
              <Clock3 size={14} aria-hidden="true" />
              {copy.timeline.peak}
            </div>
            <p className="mt-1 font-semibold text-white">
              {hasActivity && peakBucket
                ? copy.timeline.eventCount(formatNumber(peakBucket.count, copy.locale))
                : copy.notAvailable}
            </p>
          </div>
          <div className="rounded-[8px] border border-white/10 bg-ink-900/70 px-3 py-2">
            <div className="flex items-center gap-2 font-semibold text-slate-400">
              <SignalHigh size={14} aria-hidden="true" />
              {copy.timeline.strongest}
            </div>
            <p className="mt-1 font-semibold text-white">
              {strongest ? formatMagnitude(strongest.magnitude, copy.locale, copy.pendingMagnitude) : copy.notAvailable}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="overflow-x-auto">
          <div className="min-w-[680px]">
            <div className="flex h-36 items-end gap-1 border-b border-white/10 pb-2">
              {buckets.map((bucket) => {
                const tone = magnitudeTone(bucket.maxMagnitude);
                const height = bucket.count === 0 || maxCount === 0 ? 8 : Math.max(10, (bucket.count / maxCount) * 118);
                const startLabel = formatTimelineTime(bucket.start, feedId, copy.locale);
                const endLabel = formatTimelineTime(bucket.end, feedId, copy.locale);
                const title = `${copy.timeline.interval(startLabel, endLabel)}: ${copy.timeline.eventCount(
                  formatNumber(bucket.count, copy.locale),
                )}${
                  bucket.maxMagnitude !== null
                    ? `, ${formatMagnitude(bucket.maxMagnitude, copy.locale, copy.pendingMagnitude)}`
                    : ''
                }`;

                return (
                  <div key={bucket.start} className="flex min-w-0 flex-1 items-end">
                    <div
                      className="w-full rounded-t-[6px] border border-white/10 transition hover:brightness-125"
                      style={{
                        height,
                        backgroundColor: bucket.count === 0 ? 'rgba(148, 163, 184, 0.18)' : tone.color,
                        opacity: bucket.count === 0 ? 0.55 : 0.9,
                      }}
                      title={title}
                      aria-label={title}
                    />
                  </div>
                );
              })}
            </div>

            <div className="relative mt-2 h-5 text-xs text-slate-500">
              {markerIndexes.map((index) => (
                <span
                  key={index}
                  className="absolute top-0 -translate-x-1/2 whitespace-nowrap"
                  style={{ left: `${(index / (buckets.length - 1)) * 100}%` }}
                >
                  {formatTimelineTime(buckets[index].start, feedId, copy.locale)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {!isLoading && !hasActivity && (
          <p className="mt-3 rounded-[8px] border border-white/10 bg-ink-900/70 px-3 py-2 text-sm text-slate-400">
            {copy.timeline.empty}
          </p>
        )}

        {hasActivity && peakBucket && (
          <p className="mt-3 text-xs text-slate-500">
            {copy.timeline.peak}:{' '}
            <span className="text-slate-300">
              {copy.timeline.interval(
                formatDateTime(peakBucket.start, copy.locale),
                formatDateTime(peakBucket.end, copy.locale),
              )}
            </span>
          </p>
        )}
      </div>
    </section>
  );
}
