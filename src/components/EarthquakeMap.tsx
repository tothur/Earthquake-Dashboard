import { useEffect, useMemo, useState } from 'react';
import { CircleMarker, GeoJSON, MapContainer, Popup, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { ExternalLink, Layers, MapPinned } from 'lucide-react';
import type { Feature, GeoJsonObject } from 'geojson';
import type { Earthquake } from '../types';
import { formatDateTime, formatDepth, formatMagnitude, formatNumber, formatRelativeTime } from '../utils/format';
import { getMostRecent, getStrongest, magnitudeTone, markerRadius } from '../utils/earthquakes';
import type { DashboardCopy } from '../i18n';

interface EarthquakeMapProps {
  quakes: Earthquake[];
  copy: DashboardCopy;
  theme: 'light' | 'dark';
  focus: MapFocus;
  onFocusChange: (focus: MapFocus) => void;
  onQuakeSelect: (quake: Earthquake) => void;
  isLoading: boolean;
}

export type MapFocus = 'global' | 'europe' | 'hungary';

const focusBounds: Record<Exclude<MapFocus, 'global'>, L.LatLngBoundsExpression> = {
  europe: [
    [34, -25],
    [72, 45],
  ],
  hungary: [
    [44, 14],
    [50.5, 24.5],
  ],
};

const focusOptions: MapFocus[] = ['global', 'europe', 'hungary'];
const tectonicBoundariesUrl = `${import.meta.env.BASE_URL}data/tectonic-boundaries.geojson`;

interface QuakeCluster {
  id: string;
  quakes: Earthquake[];
  latitude: number;
  longitude: number;
  strongestMagnitude: number | null;
}

type TectonicFeatureProperties = {
  Type?: string;
};

function FitBounds({ quakes, focus }: { quakes: Earthquake[]; focus: MapFocus }) {
  const map = useMap();

  useEffect(() => {
    if (focus !== 'global') {
      map.fitBounds(focusBounds[focus], {
        animate: true,
        duration: 0.7,
        padding: [18, 18],
      });
      return;
    }

    if (quakes.length === 0) {
      map.setView([18, 0], 2, { animate: true });
      return;
    }

    const bounds = L.latLngBounds(quakes.map((quake) => [quake.latitude, quake.longitude]));
    map.fitBounds(bounds.pad(0.18), {
      maxZoom: quakes.length === 1 ? 5 : 7,
      animate: true,
      duration: 0.7,
    });
  }, [focus, map, quakes]);

  return null;
}

function TectonicContextLayer({ theme }: { theme: 'light' | 'dark' }) {
  const [data, setData] = useState<GeoJsonObject | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTectonicBoundaries() {
      try {
        const response = await fetch(tectonicBoundariesUrl, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Unable to load tectonic boundary data: ${response.status}`);
        }

        setData((await response.json()) as GeoJsonObject);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setData(null);
        }
      }
    }

    loadTectonicBoundaries();

    return () => controller.abort();
  }, []);

  if (!data) {
    return null;
  }

  const boundaryColor = theme === 'light' ? '#047857' : '#66e4b5';
  const subductionColor = theme === 'light' ? '#b91c1c' : '#ff858e';

  return (
    <GeoJSON
      key={theme}
      data={data}
      interactive={false}
      style={(feature?: Feature) => {
        const properties = (feature?.properties ?? {}) as TectonicFeatureProperties;
        const isSubduction = properties.Type?.toLocaleLowerCase() === 'subduction';

        return {
          color: isSubduction ? subductionColor : boundaryColor,
          dashArray: isSubduction ? undefined : '5 6',
          lineCap: 'round',
          lineJoin: 'round',
          opacity: isSubduction ? 0.82 : 0.48,
          weight: isSubduction ? 1.8 : 1.15,
        };
      }}
    />
  );
}

function getClusterCellSize(zoom: number): number {
  if (zoom <= 3) {
    return 72;
  }

  if (zoom <= 5) {
    return 58;
  }

  return 44;
}

function buildClusters(quakes: Earthquake[], map: L.Map, zoom: number): QuakeCluster[] {
  const cellSize = getClusterCellSize(zoom);
  const buckets = new Map<string, Earthquake[]>();

  quakes.forEach((quake) => {
    const point = map.project([quake.latitude, quake.longitude], zoom);
    const key = `${Math.floor(point.x / cellSize)}:${Math.floor(point.y / cellSize)}`;
    buckets.set(key, [...(buckets.get(key) ?? []), quake]);
  });

  return Array.from(buckets.entries()).map(([key, bucketQuakes]) => {
    const strongest = getStrongest(bucketQuakes);
    const latitude =
      bucketQuakes.reduce((total, quake) => total + quake.latitude, 0) / bucketQuakes.length;
    const longitude =
      bucketQuakes.reduce((total, quake) => total + quake.longitude, 0) / bucketQuakes.length;

    return {
      id: key,
      quakes: bucketQuakes,
      latitude,
      longitude,
      strongestMagnitude: strongest?.magnitude ?? null,
    };
  });
}

function clusterRadius(count: number): number {
  return Math.max(18, Math.min(31, 15 + Math.sqrt(count) * 4.5));
}

function QuakePopup({
  quake,
  copy,
  onQuakeSelect,
}: {
  quake: Earthquake;
  copy: DashboardCopy;
  onQuakeSelect: (quake: Earthquake) => void;
}) {
  return (
    <div className="quake-popup-content">
      <div className="quake-popup-kicker">
        {formatMagnitude(quake.magnitude, copy.locale, copy.pendingMagnitude)}
      </div>
      <h3>{quake.place}</h3>
      <dl>
        <div>
          <dt>{copy.map.depth}</dt>
          <dd>{formatDepth(quake.depthKm, copy.locale)}</dd>
        </div>
        <div>
          <dt>{copy.map.time}</dt>
          <dd>{formatDateTime(quake.time, copy.locale)}</dd>
        </div>
      </dl>
      <div className="quake-popup-actions">
        <button type="button" onClick={() => onQuakeSelect(quake)}>
          {copy.detail.viewDetails}
        </button>
        <a href={quake.url} target="_blank" rel="noreferrer">
          {copy.major.usgsEvent} <ExternalLink size={13} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

function ClusterPopup({ cluster, copy, map }: { cluster: QuakeCluster; copy: DashboardCopy; map: L.Map }) {
  const strongest = getStrongest(cluster.quakes);
  const latest = getMostRecent(cluster.quakes);
  const countLabel = formatNumber(cluster.quakes.length, copy.locale);

  function zoomToCluster() {
    const bounds = L.latLngBounds(cluster.quakes.map((quake) => [quake.latitude, quake.longitude]));
    map.fitBounds(bounds.pad(0.35), {
      animate: true,
      duration: 0.7,
      maxZoom: 9,
    });
  }

  return (
    <div className="quake-popup-content quake-cluster-popup-content">
      <div className="quake-popup-kicker">{copy.map.cluster(countLabel)}</div>
      <h3>{copy.map.clusterTitle(countLabel)}</h3>
      <dl>
        <div>
          <dt>{copy.map.clusterStrongest}</dt>
          <dd>
            {strongest
              ? formatMagnitude(strongest.magnitude, copy.locale, copy.pendingMagnitude)
              : copy.notAvailable}
          </dd>
        </div>
        <div>
          <dt>{copy.map.clusterLatest}</dt>
          <dd>{latest ? formatRelativeTime(latest.time, copy.locale) : copy.notAvailable}</dd>
        </div>
      </dl>
      <button type="button" onClick={zoomToCluster}>
        {copy.map.zoomCluster}
      </button>
    </div>
  );
}

function ClusteredQuakeLayer({
  quakes,
  copy,
  onQuakeSelect,
}: {
  quakes: Earthquake[];
  copy: DashboardCopy;
  onQuakeSelect: (quake: Earthquake) => void;
}) {
  const map = useMap();
  const [viewState, setViewState] = useState(() => ({
    zoom: map.getZoom(),
    bounds: map.getBounds(),
  }));

  const updateViewState = () => {
    setViewState({
      zoom: map.getZoom(),
      bounds: map.getBounds(),
    });
  };

  useMapEvents({
    moveend: updateViewState,
    zoomend: updateViewState,
  });

  const clusters = useMemo(() => {
    const paddedBounds = viewState.bounds.pad(0.25);
    const visibleQuakes = quakes.filter((quake) => paddedBounds.contains([quake.latitude, quake.longitude]));
    return buildClusters(visibleQuakes, map, viewState.zoom);
  }, [map, quakes, viewState]);

  return (
    <>
      {clusters.map((cluster) => {
        if (cluster.quakes.length === 1) {
          const quake = cluster.quakes[0];
          const tone = magnitudeTone(quake.magnitude);

          return (
            <CircleMarker
              key={quake.id}
              center={[quake.latitude, quake.longitude]}
              radius={markerRadius(quake.magnitude)}
              pathOptions={{
                color: tone.color,
                fillColor: tone.color,
                fillOpacity: 0.48,
                opacity: 0.95,
                weight: 1.5,
              }}
              eventHandlers={{
                click: () => onQuakeSelect(quake),
              }}
            >
              <Popup>
                <QuakePopup quake={quake} copy={copy} onQuakeSelect={onQuakeSelect} />
              </Popup>
            </CircleMarker>
          );
        }

        const tone = magnitudeTone(cluster.strongestMagnitude);

        return (
          <CircleMarker
            key={cluster.id}
            center={[cluster.latitude, cluster.longitude]}
            radius={clusterRadius(cluster.quakes.length)}
            pathOptions={{
              color: tone.color,
              fillColor: tone.color,
              fillOpacity: 0.34,
              opacity: 0.95,
              weight: 2,
            }}
          >
            <Tooltip permanent direction="center" className="quake-cluster-count-tooltip" opacity={1}>
              {formatNumber(cluster.quakes.length, copy.locale)}
            </Tooltip>
            <Popup>
              <ClusterPopup cluster={cluster} copy={copy} map={map} />
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}

export function EarthquakeMap({
  quakes,
  copy,
  theme,
  focus,
  onFocusChange,
  onQuakeSelect,
  isLoading,
}: EarthquakeMapProps) {
  const [showTectonicContext, setShowTectonicContext] = useState(true);
  const tileUrl =
    theme === 'light'
      ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  return (
    <section className="overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.045] shadow-panel">
      <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{copy.map.title}</h2>
          <p className="text-sm text-slate-400">{copy.map.subtitle}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <div
            className="inline-flex w-fit items-center gap-1 rounded-[8px] border border-white/10 bg-ink-900/80 p-1 text-xs shadow-panel"
            aria-label={copy.map.focusLabel}
          >
            {focusOptions.map((option) => {
              const isSelected = option === focus;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onFocusChange(option)}
                  className={`h-7 rounded-[7px] px-2.5 font-semibold transition ${
                    isSelected
                      ? 'bg-signal-green/15 text-signal-green'
                      : 'text-slate-300 hover:bg-white/[0.08] hover:text-white'
                  }`}
                  aria-pressed={isSelected}
                >
                  {copy.map.focus[option]}
                </button>
              );
            })}
          </div>
          <div
            className="inline-flex w-fit items-center gap-1 rounded-[8px] border border-white/10 bg-ink-900/80 p-1 text-xs shadow-panel"
            aria-label={copy.map.contextLabel}
          >
            <span className="hidden items-center gap-1 px-2 font-semibold text-slate-400 sm:inline-flex">
              <Layers size={14} aria-hidden="true" />
              {copy.map.contextLabel}
            </span>
            <button
              type="button"
              onClick={() => setShowTectonicContext((isVisible) => !isVisible)}
              className={`h-7 rounded-[7px] px-2.5 font-semibold transition ${
                showTectonicContext
                  ? 'bg-signal-green/15 text-signal-green'
                  : 'text-slate-300 hover:bg-white/[0.08] hover:text-white'
              }`}
              aria-pressed={showTectonicContext}
              title={copy.map.tectonicLayerDescription}
            >
              {copy.map.tectonicLayer}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-300">
            {showTectonicContext && (
              <>
                <span className="inline-flex items-center gap-2 rounded-[8px] border border-white/10 bg-ink-900/80 px-2 py-1">
                  <span className="h-0 w-5 border-t border-dashed border-signal-green" />
                  {copy.map.tectonicBoundary}
                </span>
                <span className="inline-flex items-center gap-2 rounded-[8px] border border-white/10 bg-ink-900/80 px-2 py-1">
                  <span className="h-0 w-5 border-t-2 border-signal-red" />
                  {copy.map.subductionZone}
                </span>
              </>
            )}
            {[
              ['< M4', 'bg-signal-green'],
              ['M4+', 'bg-signal-amber'],
              ['M5+', 'bg-signal-orange'],
              ['M6+', 'bg-signal-red'],
              ['M7+', 'bg-signal-violet'],
            ].map(([label, color]) => (
              <span key={label} className="inline-flex items-center gap-2 rounded-[8px] border border-white/10 bg-ink-900/80 px-2 py-1">
                <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative h-[430px] md:h-[560px]">
        <MapContainer
          className="h-full w-full"
          center={[18, 0]}
          zoom={2}
          minZoom={2}
          maxZoom={9}
          preferCanvas
          worldCopyJump
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url={tileUrl}
          />
          {showTectonicContext && <TectonicContextLayer theme={theme} />}
          <FitBounds quakes={quakes} focus={focus} />
          <ClusteredQuakeLayer quakes={quakes} copy={copy} onQuakeSelect={onQuakeSelect} />
        </MapContainer>

        {isLoading && (
          <div className="absolute inset-0 z-[500] grid place-items-center bg-ink-950/50 backdrop-blur-sm">
            <div className="inline-flex items-center gap-2 rounded-[8px] border border-white/10 bg-ink-900/90 px-4 py-3 text-sm font-semibold text-white">
              <MapPinned size={17} className="animate-pulse text-signal-green" aria-hidden="true" />
              {copy.map.loading}
            </div>
          </div>
        )}

        {!isLoading && quakes.length === 0 && (
          <div className="pointer-events-none absolute inset-x-4 top-4 z-[500] rounded-[8px] border border-white/10 bg-ink-900/90 px-4 py-3 text-sm text-slate-300">
            {copy.map.empty}
          </div>
        )}
      </div>
    </section>
  );
}
