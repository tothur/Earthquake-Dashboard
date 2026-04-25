import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Clock3,
  Globe2,
  Languages,
  MapPinned,
  Monitor,
  Moon,
  ShieldAlert,
  SignalHigh,
  Sun,
} from 'lucide-react';
import { FEEDS } from './data/feeds';
import { EarthquakeMap } from './components/EarthquakeMap';
import type { MapFocus } from './components/EarthquakeMap';
import { EarthquakeTable } from './components/EarthquakeTable';
import { EarthquakeTimeline } from './components/EarthquakeTimeline';
import { EventDetailPanel } from './components/EventDetailPanel';
import { FilterBar } from './components/FilterBar';
import { MagnitudeDistribution } from './components/MagnitudeDistribution';
import { MajorQuakeHighlight } from './components/MajorQuakeHighlight';
import { StatCard } from './components/StatCard';
import { TsunamiStatus } from './components/TsunamiStatus';
import type { Earthquake, FeedId, SortKey, SortState, TsunamiAlert, UsgsFeatureCollection } from './types';
import { COPY, type Language } from './i18n';
import {
  applyMinimumMagnitude,
  countAtLeast,
  getClosestToHungary,
  getLargestAtLeast,
  getMostRecent,
  getStrongest,
  parseEarthquakes,
  sortEarthquakes,
} from './utils/earthquakes';
import { formatDateTime, formatMagnitude, formatNumber, formatRelativeTime } from './utils/format';
import { fetchTsunamiAlerts, TSUNAMI_ALERT_SOURCE_URL } from './utils/tsunami';

type LoadStatus = 'idle' | 'loading' | 'success' | 'error';
type ThemeMode = 'auto' | 'light' | 'dark';

interface FeedState {
  status: LoadStatus;
  feedId: FeedId;
  quakes: Earthquake[];
  generatedAt: number | null;
  sourceTitle: string;
  error: string | null;
}

interface TsunamiAlertState {
  status: LoadStatus;
  alerts: TsunamiAlert[];
  updatedAt: number | null;
  error: string | null;
}

const initialFeedId: FeedId = 'day';

function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
  const [selectedFeedId, setSelectedFeedId] = useState<FeedId>(initialFeedId);
  const [minimumMagnitude, setMinimumMagnitude] = useState(0);
  const [majorMagnitudeThreshold, setMajorMagnitudeThreshold] = useState(6);
  const [mapFocus, setMapFocus] = useState<MapFocus>('global');
  const [refreshToken, setRefreshToken] = useState(0);
  const [sortState, setSortState] = useState<SortState>({ key: 'time', direction: 'desc' });
  const [isRecentListOpen, setIsRecentListOpen] = useState(false);
  const [selectedQuakeId, setSelectedQuakeId] = useState<string | null>(null);
  const mapSectionRef = useRef<HTMLDivElement | null>(null);
  const [feedState, setFeedState] = useState<FeedState>({
    status: 'idle',
    feedId: initialFeedId,
    quakes: [],
    generatedAt: null,
    sourceTitle: '',
    error: null,
  });
  const [tsunamiAlertState, setTsunamiAlertState] = useState<TsunamiAlertState>({
    status: 'idle',
    alerts: [],
    updatedAt: null,
    error: null,
  });

  const selectedFeed = useMemo(
    () => FEEDS.find((feed) => feed.id === selectedFeedId) ?? FEEDS[1],
    [selectedFeedId],
  );
  const copy = COPY[language];
  const selectedFeedLabel = copy.feeds[selectedFeed.id].label;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function applyTheme() {
      const resolvedTheme = themeMode === 'auto' ? (mediaQuery.matches ? 'dark' : 'light') : themeMode;
      document.documentElement.dataset.theme = resolvedTheme;
      setResolvedTheme(resolvedTheme);

      const themeColor = resolvedTheme === 'dark' ? '#080a0d' : '#f8fafc';
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
    }

    applyTheme();
    mediaQuery.addEventListener('change', applyTheme);

    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, [themeMode]);

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

  useEffect(() => {
    const controller = new AbortController();

    setTsunamiAlertState((current) => ({
      ...current,
      status: 'loading',
      error: null,
    }));

    async function loadTsunamiAlerts() {
      try {
        const result = await fetchTsunamiAlerts(controller.signal);

        setTsunamiAlertState({
          status: 'success',
          alerts: result.alerts,
          updatedAt: result.updatedAt,
          error: null,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setTsunamiAlertState((current) => ({
          ...current,
          status: 'error',
          error: error instanceof Error ? error.message : copy.tsunami.alertFeedFallback,
        }));
      }
    }

    loadTsunamiAlerts();

    return () => controller.abort();
  }, [copy.tsunami.alertFeedFallback, refreshToken]);

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
  const majorQuake = useMemo(
    () => getLargestAtLeast(feedState.quakes, majorMagnitudeThreshold),
    [feedState.quakes, majorMagnitudeThreshold],
  );
  const closestToHungary = useMemo(() => getClosestToHungary(filteredQuakes), [filteredQuakes]);
  const selectedQuake = useMemo(
    () => feedState.quakes.find((quake) => quake.id === selectedQuakeId) ?? null,
    [feedState.quakes, selectedQuakeId],
  );
  const isLoading = feedState.status === 'loading';

  useEffect(() => {
    if (selectedQuakeId && !selectedQuake && feedState.status === 'success') {
      setSelectedQuakeId(null);
    }
  }, [feedState.status, selectedQuake, selectedQuakeId]);

  function handleSortChange(key: SortKey) {
    setSortState((current) => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc',
    }));
  }

  function handleClosestToHungarySelect() {
    if (!closestToHungary) {
      return;
    }

    setSelectedQuakeId(closestToHungary.quake.id);
    window.requestAnimationFrame(() => {
      mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.05] px-3 py-1 text-sm font-semibold text-signal-green">
              <Globe2 size={16} aria-hidden="true" />
              {copy.appBadge}
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">{copy.title}</h1>
          </div>

          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:w-fit lg:flex-col lg:items-end">
            <div className="flex min-w-0 items-center justify-between gap-2 rounded-[8px] border border-white/10 bg-white/[0.045] p-1 text-sm shadow-panel sm:justify-start lg:w-fit">
              <span className="flex min-w-0 items-center gap-2 whitespace-nowrap px-2 font-medium text-slate-400">
                <Languages size={16} aria-hidden="true" />
                {copy.language}
              </span>
              {(['en', 'hu'] as Language[]).map((option) => {
                const isSelected = option === language;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setLanguage(option)}
                    className={`h-8 rounded-[8px] px-3 text-sm font-semibold transition ${
                      isSelected
                        ? 'bg-signal-green/15 text-signal-green'
                        : 'text-slate-300 hover:bg-white/[0.07] hover:text-white'
                    }`}
                    aria-pressed={isSelected}
                    aria-label={COPY[option].languageName}
                  >
                    {COPY[option].languageShort}
                  </button>
                );
              })}
            </div>

            <div className="flex min-w-0 items-center justify-between gap-1 rounded-[8px] border border-white/10 bg-white/[0.045] p-1 text-sm shadow-panel sm:justify-start lg:w-fit">
              <span className="flex min-w-0 items-center gap-2 whitespace-nowrap px-2 font-medium text-slate-400">
                <Monitor size={16} aria-hidden="true" />
                {copy.theme.label}
              </span>
              {([
                { mode: 'auto', label: copy.theme.auto, icon: Monitor },
                { mode: 'light', label: copy.theme.light, icon: Sun },
                { mode: 'dark', label: copy.theme.dark, icon: Moon },
              ] as Array<{ mode: ThemeMode; label: string; icon: typeof Monitor }>).map(({ mode, label, icon: Icon }) => {
                const isSelected = mode === themeMode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setThemeMode(mode)}
                    className={`inline-flex h-8 items-center gap-1.5 rounded-[8px] px-2.5 text-sm font-semibold transition ${
                      isSelected
                        ? 'bg-signal-green/15 text-signal-green'
                        : 'text-slate-300 hover:bg-white/[0.07] hover:text-white'
                    }`}
                    aria-pressed={isSelected}
                    aria-label={label}
                    title={label}
                  >
                    <Icon size={15} aria-hidden="true" />
                    <span className={mode === 'auto' ? 'hidden sm:inline' : 'sr-only'}>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        <FilterBar
          selectedFeedId={selectedFeedId}
          minimumMagnitude={minimumMagnitude}
          majorMagnitudeThreshold={majorMagnitudeThreshold}
          copy={copy}
          isLoading={isLoading}
          onFeedChange={setSelectedFeedId}
          onMinimumMagnitudeChange={setMinimumMagnitude}
          onMajorMagnitudeThresholdChange={setMajorMagnitudeThreshold}
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
                  <p className="font-semibold text-white">{copy.error.title}</p>
                  <p className="mt-1 text-slate-300">
                    {feedState.error || copy.error.fallback} {copy.error.body}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRefreshToken((token) => token + 1)}
                className="inline-flex h-9 w-fit items-center rounded-[8px] border border-white/10 bg-white/[0.08] px-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.13]"
              >
                {copy.error.retry}
              </button>
            </div>
          </section>
        )}

        <MajorQuakeHighlight
          quake={majorQuake}
          feedLabel={selectedFeedLabel}
          magnitudeThreshold={majorMagnitudeThreshold}
          copy={copy}
          isLoading={isLoading && feedState.quakes.length === 0}
          onQuakeSelect={(quake) => setSelectedQuakeId(quake.id)}
        />

        <TsunamiStatus
          quakes={feedState.quakes}
          alerts={tsunamiAlertState.alerts}
          alertStatus={tsunamiAlertState.status}
          alertUpdatedAt={tsunamiAlertState.updatedAt}
          alertError={tsunamiAlertState.error}
          feedLabel={selectedFeedLabel}
          copy={copy}
          isLoading={isLoading && feedState.quakes.length === 0}
          onQuakeSelect={(quake) => setSelectedQuakeId(quake.id)}
        />

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            icon={Activity}
            label={copy.stats.displayed}
            value={formatNumber(filteredQuakes.length, copy.locale)}
            detail={copy.stats.displayedDetail(selectedFeedLabel, minimumMagnitude)}
            tone="green"
          />
          <StatCard
            icon={SignalHigh}
            label={copy.stats.strongest}
            value={strongest ? formatMagnitude(strongest.magnitude, copy.locale, copy.pendingMagnitude) : copy.notAvailable}
            detail={strongest ? strongest.place : copy.stats.strongestEmpty}
            tone="amber"
          />
          <StatCard
            icon={Clock3}
            label={copy.stats.mostRecent}
            value={mostRecent ? formatRelativeTime(mostRecent.time, copy.locale) : copy.notAvailable}
            detail={mostRecent ? mostRecent.place : copy.stats.mostRecentEmpty}
            tone="violet"
          />
          <StatCard
            icon={MapPinned}
            label={copy.stats.closestToHungary}
            value={closestToHungary ? `${formatNumber(Math.round(closestToHungary.distanceKm), copy.locale)} km` : copy.notAvailable}
            detail={
              closestToHungary
                ? `${formatMagnitude(closestToHungary.quake.magnitude, copy.locale, copy.pendingMagnitude)} ${closestToHungary.quake.place}`
                : copy.stats.closestEmpty
            }
            tone="orange"
            onClick={closestToHungary ? handleClosestToHungarySelect : undefined}
            actionLabel={copy.stats.closestAction}
          />
          <StatCard
            icon={ShieldAlert}
            label={copy.stats.magnitude6}
            value={formatNumber(countAtLeast(filteredQuakes, 6), copy.locale)}
            detail={copy.stats.magnitude6Detail}
            tone="red"
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
          <EarthquakeTimeline
            quakes={filteredQuakes}
            feedId={selectedFeedId}
            copy={copy}
            isLoading={isLoading && feedState.quakes.length === 0}
          />
          <MagnitudeDistribution
            quakes={filteredQuakes}
            copy={copy}
            isLoading={isLoading && feedState.quakes.length === 0}
          />
        </section>

        <div ref={mapSectionRef}>
          <EarthquakeMap
            quakes={filteredQuakes}
            tsunamiAlerts={tsunamiAlertState.alerts}
            selectedQuake={selectedQuake}
            copy={copy}
            theme={resolvedTheme}
            focus={mapFocus}
            onFocusChange={setMapFocus}
            onQuakeSelect={(quake) => setSelectedQuakeId(quake.id)}
            isLoading={isLoading && feedState.quakes.length === 0}
          />
        </div>

        <EarthquakeTable
          quakes={sortedQuakes}
          sortState={sortState}
          copy={copy}
          isLoading={isLoading && feedState.quakes.length === 0}
          isOpen={isRecentListOpen}
          onToggle={() => setIsRecentListOpen((isOpen) => !isOpen)}
          onSortChange={handleSortChange}
          onQuakeSelect={(quake) => setSelectedQuakeId(quake.id)}
        />

        <footer className="flex flex-col items-center gap-2 pb-3 text-center text-xs text-slate-500">
          <p className="max-w-4xl text-sm leading-6 text-slate-400">{copy.footer.description}</p>
          <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-2">
            <span>{copy.footer.feedStatus}</span>
            <span>{selectedFeedLabel}</span>
            <span className="hidden sm:inline">·</span>
            <span>{feedState.generatedAt ? `${copy.footer.generated} ${formatDateTime(feedState.generatedAt, copy.locale)}` : copy.footer.awaiting}</span>
            <span className="hidden sm:inline">·</span>
            <a href={selectedFeed.url} target="_blank" rel="noreferrer" className="text-signal-green transition hover:text-white">
              {copy.footer.source}
            </a>
            <span className="hidden sm:inline">·</span>
            <a href={TSUNAMI_ALERT_SOURCE_URL} target="_blank" rel="noreferrer" className="text-signal-green transition hover:text-white">
              {copy.footer.tsunamiSource}
            </a>
          </div>
        </footer>
      </div>
      <EventDetailPanel quake={selectedQuake} copy={copy} onClose={() => setSelectedQuakeId(null)} />
    </div>
  );
}

export default App;
