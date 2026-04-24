import { useEffect } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ExternalLink, MapPinned } from 'lucide-react';
import type { Earthquake } from '../types';
import { formatDateTime, formatDepth, formatMagnitude } from '../utils/format';
import { magnitudeTone, markerRadius } from '../utils/earthquakes';
import type { DashboardCopy } from '../i18n';

interface EarthquakeMapProps {
  quakes: Earthquake[];
  copy: DashboardCopy;
  theme: 'light' | 'dark';
  isLoading: boolean;
}

function FitBounds({ quakes }: { quakes: Earthquake[] }) {
  const map = useMap();

  useEffect(() => {
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
  }, [map, quakes]);

  return null;
}

export function EarthquakeMap({ quakes, copy, theme, isLoading }: EarthquakeMapProps) {
  const tileUrl =
    theme === 'light'
      ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  return (
    <section className="overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.045] shadow-panel">
      <div className="flex flex-col gap-2 border-b border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{copy.map.title}</h2>
          <p className="text-sm text-slate-400">{copy.map.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-300">
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
          <FitBounds quakes={quakes} />
          {quakes.map((quake) => {
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
              >
                <Popup>
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
                    <a href={quake.url} target="_blank" rel="noreferrer">
                      {copy.major.usgsEvent} <ExternalLink size={13} aria-hidden="true" />
                    </a>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
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
