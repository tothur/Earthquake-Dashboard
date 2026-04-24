import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import type { Earthquake, SortKey, SortState } from '../types';
import { formatDateTime, formatDepth, formatMagnitude, formatRelativeTime } from '../utils/format';
import { magnitudeTone } from '../utils/earthquakes';

interface EarthquakeTableProps {
  quakes: Earthquake[];
  sortState: SortState;
  isLoading: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onSortChange: (key: SortKey) => void;
}

const columns: Array<{ key: SortKey; label: string; align?: 'right' | 'left' }> = [
  { key: 'time', label: 'Time' },
  { key: 'magnitude', label: 'Magnitude', align: 'right' },
  { key: 'depthKm', label: 'Depth', align: 'right' },
  { key: 'place', label: 'Location' },
];

export function EarthquakeTable({ quakes, sortState, isLoading, isOpen, onToggle, onSortChange }: EarthquakeTableProps) {
  return (
    <section className="overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.045] shadow-panel">
      <div className={clsx('px-4 py-3', isOpen && 'border-b border-white/10')}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Recent Earthquakes</h2>
            <p className="text-sm text-slate-400">Sorted list of events currently shown on the map.</p>
          </div>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-controls="recent-earthquakes-panel"
            className="inline-flex h-10 w-fit items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.06] px-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.1]"
          >
            {isOpen ? <ChevronDown size={16} aria-hidden="true" /> : <ChevronRight size={16} aria-hidden="true" />}
            {isOpen ? 'Hide list' : 'Show list'}
            <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-slate-300">{quakes.length}</span>
          </button>
        </div>
        {!isOpen && (
          <p className="mt-3 text-sm text-slate-400">
            {quakes.length} events available. Expand the list to inspect, sort, and open individual USGS event records.
          </p>
        )}
      </div>

      {isOpen && (
        <div id="recent-earthquakes-panel">
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full border-collapse text-left">
              <thead className="bg-ink-900/80 text-sm text-slate-400">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className={clsx('px-4 py-3 font-semibold', column.align === 'right' && 'text-right')}
                      aria-sort={
                        sortState.key === column.key
                          ? sortState.direction === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                    >
                      <button
                        type="button"
                        onClick={() => onSortChange(column.key)}
                        className={clsx(
                          'inline-flex items-center gap-1 rounded-[8px] px-1 py-1 transition hover:bg-white/[0.06] hover:text-white',
                          column.align === 'right' && 'ml-auto',
                        )}
                      >
                        {column.label}
                        {sortState.key === column.key ? (
                          sortState.direction === 'asc' ? (
                            <ArrowUp size={14} aria-hidden="true" />
                          ) : (
                            <ArrowDown size={14} aria-hidden="true" />
                          )
                        ) : (
                          <span className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                      </button>
                    </th>
                  ))}
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {isLoading
                  ? Array.from({ length: 7 }, (_, index) => (
                      <tr key={index}>
                        <td className="px-4 py-4">
                          <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="ml-auto h-6 w-16 animate-pulse rounded bg-white/10" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="ml-auto h-4 w-16 animate-pulse rounded bg-white/10" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="h-4 w-72 animate-pulse rounded bg-white/10" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="ml-auto h-8 w-8 animate-pulse rounded bg-white/10" />
                        </td>
                      </tr>
                    ))
                  : quakes.map((quake) => {
                      const tone = magnitudeTone(quake.magnitude);
                      return (
                        <tr key={quake.id} className="transition hover:bg-white/[0.035]">
                          <td className="px-4 py-4 align-top">
                            <div className="font-medium text-white">{formatRelativeTime(quake.time)}</div>
                            <div className="mt-1 text-sm text-slate-400">{formatDateTime(quake.time)}</div>
                          </td>
                          <td className="px-4 py-4 text-right align-top">
                            <span
                              className="inline-flex min-w-16 justify-center rounded-[8px] px-2.5 py-1 text-sm font-semibold"
                              style={{ color: tone.color, backgroundColor: tone.background }}
                            >
                              {formatMagnitude(quake.magnitude)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right align-top text-slate-200">{formatDepth(quake.depthKm)}</td>
                          <td className="px-4 py-4 align-top">
                            <div className="max-w-[390px] font-medium text-white">{quake.place}</div>
                            <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-400">
                              <span>Status: {quake.status}</span>
                              {quake.felt !== null && <span>Felt reports: {quake.felt}</span>}
                              {quake.tsunami && <span className="font-semibold text-signal-orange">Tsunami flag</span>}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right align-top">
                            <a
                              href={quake.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.05] text-slate-200 transition hover:border-white/20 hover:bg-white/[0.1] hover:text-white"
                              aria-label={`Open USGS event for ${quake.place}`}
                            >
                              <ExternalLink size={16} aria-hidden="true" />
                            </a>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>

          {!isLoading && quakes.length === 0 && (
            <div className="border-t border-white/10 px-4 py-10 text-center">
              <p className="font-semibold text-white">No earthquakes match the current filters.</p>
              <p className="mt-2 text-sm text-slate-400">Lower the minimum magnitude or choose a wider time range.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
