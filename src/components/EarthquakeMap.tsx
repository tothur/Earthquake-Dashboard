import { useEffect } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ExternalLink, MapPinned } from 'lucide-react';
import type { Earthquake } from '../types';
import { formatDateTime, formatDepth, formatMagnitude } from '../utils/format';
import { magnitudeTone, markerRadius } from '../utils/earthquakes';

interface EarthquakeMapProps {
  quakes: Earthquake[];
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

export function EarthquakeMap({ quakes, isLoading }: EarthquakeMapProps) {
  return (
    <section className="overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.045] shadow-panel">
      <div className="flex flex-col gap-2 border-b border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Global Seismic Map</h2>
          <p className="text-sm text-slate-400">Marker color and size scale with reported magnitude.</p>
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
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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
                    <div className="quake-popup-kicker">{formatMagnitude(quake.magnitude)}</div>
                    <h3>{quake.place}</h3>
                    <dl>
                      <div>
                        <dt>Depth</dt>
                        <dd>{formatDepth(quake.depthKm)}</dd>
                      </div>
                      <div>
                        <dt>Time</dt>
                        <dd>{formatDateTime(quake.time)}</dd>
                      </div>
                    </dl>
                    <a href={quake.url} target="_blank" rel="noreferrer">
                      USGS event <ExternalLink size={13} aria-hidden="true" />
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
              Loading USGS feed
            </div>
          </div>
        )}

        {!isLoading && quakes.length === 0 && (
          <div className="pointer-events-none absolute inset-x-4 top-4 z-[500] rounded-[8px] border border-white/10 bg-ink-900/90 px-4 py-3 text-sm text-slate-300">
            No earthquakes match the active filters.
          </div>
        )}
      </div>
    </section>
  );
}
