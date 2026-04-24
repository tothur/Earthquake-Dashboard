import { RadioTower, RefreshCw, SlidersHorizontal } from 'lucide-react';
import clsx from 'clsx';
import { FEEDS, MAJOR_MAGNITUDE_OPTIONS, MIN_MAGNITUDE_OPTIONS } from '../data/feeds';
import type { FeedId } from '../types';
import type { DashboardCopy } from '../i18n';

interface FilterBarProps {
  selectedFeedId: FeedId;
  minimumMagnitude: number;
  majorMagnitudeThreshold: number;
  copy: DashboardCopy;
  isLoading: boolean;
  onFeedChange: (feedId: FeedId) => void;
  onMinimumMagnitudeChange: (value: number) => void;
  onMajorMagnitudeThresholdChange: (value: number) => void;
  onRefresh: () => void;
}

export function FilterBar({
  selectedFeedId,
  minimumMagnitude,
  majorMagnitudeThreshold,
  copy,
  isLoading,
  onFeedChange,
  onMinimumMagnitudeChange,
  onMajorMagnitudeThresholdChange,
  onRefresh,
}: FilterBarProps) {
  return (
    <section className="flex flex-col gap-3 rounded-[8px] border border-white/10 bg-white/[0.04] p-3 shadow-panel md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2" aria-label={copy.filter.timeRange}>
        {FEEDS.map((feed) => {
          const isSelected = feed.id === selectedFeedId;
          const feedCopy = copy.feeds[feed.id];
          return (
            <button
              key={feed.id}
              type="button"
              onClick={() => onFeedChange(feed.id)}
              className={clsx(
                'inline-flex h-10 items-center gap-2 rounded-[8px] border px-3 text-sm font-medium transition',
                isSelected
                  ? 'border-signal-green/60 bg-signal-green/15 text-signal-green'
                  : 'border-white/10 bg-ink-900/80 text-slate-300 hover:border-white/20 hover:bg-white/[0.07]',
              )}
              title={feedCopy.description}
            >
              <span className="font-semibold">{feedCopy.shortLabel}</span>
              <span className="hidden sm:inline">{feedCopy.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-white/10 bg-ink-900/80 px-3 text-sm text-slate-300">
          <SlidersHorizontal size={16} className="text-slate-400" aria-hidden="true" />
          <span className="font-medium">{copy.filter.minMagnitude}</span>
          <select
            value={minimumMagnitude}
            onChange={(event) => onMinimumMagnitudeChange(Number(event.target.value))}
            className="bg-transparent font-semibold text-white outline-none"
            aria-label={copy.filter.minimumMagnitudeAria}
          >
            {MIN_MAGNITUDE_OPTIONS.map((option) => (
              <option key={option} value={option} className="bg-ink-900 text-white">
                {option === 0 ? copy.filter.all : `M ${option}+`}
              </option>
            ))}
          </select>
        </label>

        <label className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-white/10 bg-ink-900/80 px-3 text-sm text-slate-300">
          <RadioTower size={16} className="text-slate-400" aria-hidden="true" />
          <span className="font-medium">{copy.filter.watchThreshold}</span>
          <select
            value={majorMagnitudeThreshold}
            onChange={(event) => onMajorMagnitudeThresholdChange(Number(event.target.value))}
            className="bg-transparent font-semibold text-white outline-none"
            aria-label={copy.filter.watchThresholdAria}
          >
            {MAJOR_MAGNITUDE_OPTIONS.map((option) => (
              <option key={option} value={option} className="bg-ink-900 text-white">
                M {option.toFixed(1)}+
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.06] px-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.1] disabled:cursor-wait disabled:opacity-60"
          disabled={isLoading}
        >
          <RefreshCw size={16} className={clsx(isLoading && 'animate-spin')} aria-hidden="true" />
          {copy.filter.refresh}
        </button>
      </div>
    </section>
  );
}
