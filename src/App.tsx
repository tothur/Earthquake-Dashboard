import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Clock3,
  DatabaseZap,
  Globe2,
  RadioTower,
  ShieldAlert,
  SignalHigh,
} from 'lucide-react';
import { FEEDS } from './data/feeds';
import { EarthquakeMap } from './components/EarthquakeMap';
import { EarthquakeTable } from './components/EarthquakeTable';
import { FilterBar } from './components/FilterBar';
import { MajorQuakeHighlight } from './components/MajorQuakeHighlight';
import { StatCard } from './components/StatCard';
import type { Earthquake, FeedId, SortKey, SortState, UsgsFeatureCollection } from './types';
import {
  applyMinimumMagnitude,
  countAtLeast,
  getLargestM7Plus,
  getMostRecent,
  getStrongest,
  parseEarthquakes,
  sortEarthquakes,
} from './utils/earthquakes';
import { formatDateTime, formatMagnitude, formatNumber, formatRelativeTime } from './utils/format';

type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

interface FeedState {
  status: LoadStatus;
  feedId: FeedId;
  quakes: Earthquake[];
  generatedAt: number | null;
  sourceTitle: string;
  error: string | null;
}

const initialFeedId: FeedId = 'day';

function App() {
  const [selectedFeedId, setSelectedFeedId] = useState<FeedId>(initialFeedId);
  const [minimumMagnitude, setMinimumMagnitude] = useState(0);
  const [refreshToken, setRefreshToken] = useState(0);
  const [sortState, setSortState] = useState<SortState>({ key: 'time', direction: 'desc' });
  const [isRecentListOpen, setIsRecentListOpen] = useState(false);
  const [feedState, setFeedState] = useState<FeedState>({
    status: 'idle',
    feedId: initialFeedId,
    quakes: [],
    generatedAt: null,
    sourceTitle: '',
    error: null,
  });

  const selectedFeed = useMemo(
    () => FEEDS.find((feed) => feed.id === selectedFeedId) ?? FEEDS[1],
    [selectedFeedId],
  );

  useEffect(() => {
    const controller = new AbortController();

    setFeedState((current) => ({
      status: 'loading',
      feedId: selectedFeed.id,
      quakes: current.feedId === selectedFeed.id ? current.quakes : [],
      generatedAt: current.feedId === selectedFeed.id ? current.generatedAt : null,
      sourceTitle: current.feedId === selectedFeed.id ? current.sourceTitle : '',
      error: null,
    }));

    async function loadEarthquakes() {
      try {
        const response = await fetch(selectedFeed.url, {
          signal: controller.signal,
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`USGS returned HTTP ${response.status}.`);
        }

        const payload = (await response.json()) as UsgsFeatureCollection;
        const quakes = parseEarthquakes(payload);

        setFeedState({
          status: 'success',
          feedId: selectedFeed.id,
          quakes,
          generatedAt: payload.metadata?.generated ?? Date.now(),
          sourceTitle: payload.metadata?.title ?? selectedFeed.description,
          error: null,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setFeedState((current) => ({
          ...current,
          status: 'error',
          feedId: selectedFeed.id,
          error: error instanceof Error ? error.message : 'Unable to load the USGS earthquake feed.',
        }));
      }
    }

    loadEarthquakes();

    return () => controller.abort();
  }, [refreshToken, selectedFeed]);

  const filteredQuakes = useMemo(
    () => applyMinimumMagnitude(feedState.quakes, minimumMagnitude),
    [feedState.quakes, minimumMagnitude],
  );

  const sortedQuakes = useMemo(
    () => sortEarthquakes(filteredQuakes, sortState),
    [filteredQuakes, sortState],
  );

  const strongest = useMemo(() => getStrongest(filteredQuakes), [filteredQuakes]);
  const mostRecent = useMemo(() => getMostRecent(filteredQuakes), [filteredQuakes]);
  const majorQuake = useMemo(() => getLargestM7Plus(feedState.quakes), [feedState.quakes]);
  const isLoading = feedState.status === 'loading';

  function handleSortChange(key: SortKey) {
    setSortState((current) => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc',
    }));
  }

  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <header>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.05] px-3 py-1 text-sm font-semibold text-signal-green">
              <Globe2 size={16} aria-hidden="true" />
              USGS Earthquake Hazards Program
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">Earthquake Tracker</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-400">
              Real-time global seismic monitoring using official USGS GeoJSON feeds, with magnitude-scaled map markers,
              live summary metrics, and sortable event detail.
            </p>
          </div>
        </header>

        <FilterBar
          selectedFeedId={selectedFeedId}
          minimumMagnitude={minimumMagnitude}
          isLoading={isLoading}
          onFeedChange={setSelectedFeedId}
          onMinimumMagnitudeChange={setMinimumMagnitude}
          onRefresh={() => setRefreshToken((token) => token + 1)}
        />

        {feedState.error && (
          <section
            className="rounded-[8px] border border-signal-red/25 bg-signal-red/10 px-4 py-3 text-sm text-slate-200"
            role="status"
            aria-live="polite"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <AlertTriangle size={19} className="mt-0.5 shrink-0 text-signal-red" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-white">USGS feed unavailable</p>
                  <p className="mt-1 text-slate-300">
                    {feedState.error} The dashboard remains available; retry the feed or switch time ranges.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRefreshToken((token) => token + 1)}
                className="inline-flex h-9 w-fit items-center rounded-[8px] border border-white/10 bg-white/[0.08] px-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.13]"
              >
                Retry
              </button>
            </div>
          </section>
        )}

        <MajorQuakeHighlight quake={majorQuake} feedLabel={selectedFeed.label} isLoading={isLoading && feedState.quakes.length === 0} />

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            icon={Activity}
            label="Displayed earthquakes"
            value={formatNumber(filteredQuakes.length)}
            detail={`${selectedFeed.label}${minimumMagnitude > 0 ? `, M ${minimumMagnitude}+` : ', all magnitudes'}`}
            tone="green"
          />
          <StatCard
            icon={SignalHigh}
            label="Strongest earthquake"
            value={strongest ? formatMagnitude(strongest.magnitude) : 'None'}
            detail={strongest ? strongest.place : 'No event in the current filter'}
            tone="amber"
          />
          <StatCard
            icon={Clock3}
            label="Most recent"
            value={mostRecent ? formatRelativeTime(mostRecent.time) : 'None'}
            detail={mostRecent ? mostRecent.place : 'No recent event in the current filter'}
            tone="violet"
          />
          <StatCard
            icon={RadioTower}
            label="Magnitude 5+"
            value={formatNumber(countAtLeast(filteredQuakes, 5))}
            detail="Events meeting or exceeding M 5.0"
            tone="orange"
          />
          <StatCard
            icon={ShieldAlert}
            label="Magnitude 6+"
            value={formatNumber(countAtLeast(filteredQuakes, 6))}
            detail="Events meeting or exceeding M 6.0"
            tone="red"
          />
        </section>

        <EarthquakeMap quakes={filteredQuakes} isLoading={isLoading && feedState.quakes.length === 0} />

        <EarthquakeTable
          quakes={sortedQuakes}
          sortState={sortState}
          isLoading={isLoading && feedState.quakes.length === 0}
          isOpen={isRecentListOpen}
          onToggle={() => setIsRecentListOpen((isOpen) => !isOpen)}
          onSortChange={handleSortChange}
        />

        <section className="rounded-[8px] border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-slate-300 shadow-panel">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 font-semibold text-white">
                <DatabaseZap size={16} className="text-signal-green" aria-hidden="true" />
                Feed status
              </div>
              <p className="mt-2">
                {feedState.generatedAt ? `Generated ${formatDateTime(feedState.generatedAt)}` : 'Awaiting USGS data'}
              </p>
              <p className="mt-1 text-slate-400">{feedState.sourceTitle || selectedFeed.description}</p>
            </div>
            <a
              href={selectedFeed.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center rounded-[8px] border border-white/10 bg-white/[0.06] px-3 py-2 font-semibold text-signal-green transition hover:border-white/20 hover:bg-white/[0.1] hover:text-white"
            >
              Open source feed
            </a>
          </div>
        </section>

        <footer className="pb-3 text-center text-xs text-slate-500">
          {feedState.sourceTitle || selectedFeed.description} Data is fetched directly in the browser from USGS.
        </footer>
      </div>
    </div>
  );
}

export default App;
