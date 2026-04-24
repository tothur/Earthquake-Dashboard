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
    <section className="rounded-[8px] border border-white/10 bg-white/[0.04] p-2 shadow-panel">
      <div className="grid gap-2 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
        <div
          className="grid grid-cols-3 gap-1 rounded-[8px] border border-white/10 bg-ink-900/80 p-1"
          aria-label={copy.filter.timeRange}
        >
          {FEEDS.map((feed) => {
            const isSelected = feed.id === selectedFeedId;
            const feedCopy = copy.feeds[feed.id];
            return (
              <button
                key={feed.id}
                type="button"
                onClick={() => onFeedChange(feed.id)}
                className={clsx(
                  'inline-flex h-8 min-w-0 items-center justify-center gap-1.5 rounded-[7px] px-2 text-xs font-medium transition sm:min-w-20',
                  isSelected
                    ? 'bg-signal-green/15 text-signal-green'
                    : 'text-slate-300 hover:bg-white/[0.07] hover:text-white',
                )}
                title={feedCopy.description}
              >
                <span className="font-semibold">{feedCopy.shortLabel}</span>
                <span className="hidden xl:inline">{feedCopy.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.25rem] gap-2 sm:grid-cols-[auto_auto_2.25rem] lg:justify-end">
          <label className="inline-flex h-9 min-w-0 items-center gap-2 rounded-[8px] border border-white/10 bg-ink-900/80 px-2.5 text-sm text-slate-300">
            <SlidersHorizontal size={16} className="text-slate-400" aria-hidden="true" />
            <span className="hidden whitespace-nowrap font-medium md:inline">{copy.filter.minMagnitude}</span>
            <select
              value={minimumMagnitude}
              onChange={(event) => onMinimumMagnitudeChange(Number(event.target.value))}
              className="min-w-0 bg-transparent font-semibold text-white outline-none"
              aria-label={copy.filter.minimumMagnitudeAria}
            >
              {MIN_MAGNITUDE_OPTIONS.map((option) => (
                <option key={option} value={option} className="bg-ink-900 text-white">
                  {option === 0 ? copy.filter.all : `M ${option}+`}
                </option>
              ))}
            </select>
          </label>

          <label className="inline-flex h-9 min-w-0 items-center gap-2 rounded-[8px] border border-white/10 bg-ink-900/80 px-2.5 text-sm text-slate-300">
            <RadioTower size={16} className="text-slate-400" aria-hidden="true" />
            <span className="hidden whitespace-nowrap font-medium md:inline">{copy.filter.watchThreshold}</span>
            <select
              value={majorMagnitudeThreshold}
              onChange={(event) => onMajorMagnitudeThresholdChange(Number(event.target.value))}
              className="min-w-0 bg-transparent font-semibold text-white outline-none"
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.06] text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.1] disabled:cursor-wait disabled:opacity-60"
            disabled={isLoading}
            aria-label={copy.filter.refresh}
            title={copy.filter.refresh}
          >
            <RefreshCw size={16} className={clsx(isLoading && 'animate-spin')} aria-hidden="true" />
            <span className="sr-only">{copy.filter.refresh}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
