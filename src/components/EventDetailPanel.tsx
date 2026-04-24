import { ExternalLink, MapPin, Ruler, SignalHigh, Waves, X } from 'lucide-react';
import type { DashboardCopy } from '../i18n';
import type { Earthquake } from '../types';
import { magnitudeTone } from '../utils/earthquakes';
import { formatDateTime, formatDepth, formatMagnitude, formatNumber } from '../utils/format';

interface EventDetailPanelProps {
  quake: Earthquake | null;
  copy: DashboardCopy;
  onClose: () => void;
}

function formatCoordinate(value: number, positiveDirection: string, negativeDirection: string, locale: string): string {
  const coordinate = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(Math.abs(value));

  return `${coordinate}° ${value >= 0 ? positiveDirection : negativeDirection}`;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 py-3 last:border-b-0">
      <dt className="text-sm text-slate-400">{label}</dt>
      <dd className="text-right text-sm font-semibold text-slate-100">{value}</dd>
    </div>
  );
}

export function EventDetailPanel({ quake, copy, onClose }: EventDetailPanelProps) {
  if (!quake) {
    return null;
  }

  const tone = magnitudeTone(quake.magnitude);
  const latitude = formatCoordinate(quake.latitude, 'N', 'S', copy.locale);
  const longitude = formatCoordinate(quake.longitude, 'E', 'W', copy.locale);

  return (
    <div className="fixed inset-0 z-[1000] pointer-events-none">
      <button
        type="button"
        className="absolute inset-0 hidden bg-ink-950/45 backdrop-blur-[2px] pointer-events-auto lg:block"
        onClick={onClose}
        aria-label={copy.detail.close}
      />

      <aside
        className="pointer-events-auto absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col border-l border-white/10 bg-ink-950/[0.98] shadow-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-detail-title"
      >
        <div className="border-b border-white/10 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-signal-green">{copy.detail.subtitle}</p>
              <h2 id="event-detail-title" className="mt-1 text-xl font-semibold leading-tight text-white">
                {copy.detail.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.06] text-slate-200 transition hover:border-white/20 hover:bg-white/[0.12] hover:text-white"
              aria-label={copy.detail.close}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <section>
            <div
              className="inline-flex rounded-[8px] px-3 py-1 text-sm font-semibold"
              style={{ color: tone.color, backgroundColor: tone.background }}
            >
              {formatMagnitude(quake.magnitude, copy.locale, copy.pendingMagnitude)}
            </div>
            <h3 className="mt-4 text-2xl font-semibold leading-tight text-white">{quake.place}</h3>
            <p className="mt-2 text-sm text-slate-400">{formatDateTime(quake.time, copy.locale)}</p>
          </section>

          <section className="mt-5 grid grid-cols-2 gap-3">
            <article className="rounded-[8px] border border-white/10 bg-white/[0.045] p-3">
              <SignalHigh size={17} className="text-signal-amber" aria-hidden="true" />
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{copy.detail.magnitude}</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {formatMagnitude(quake.magnitude, copy.locale, copy.pendingMagnitude)}
              </p>
            </article>
            <article className="rounded-[8px] border border-white/10 bg-white/[0.045] p-3">
              <Ruler size={17} className="text-signal-green" aria-hidden="true" />
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{copy.detail.depth}</p>
              <p className="mt-1 text-lg font-semibold text-white">{formatDepth(quake.depthKm, copy.locale)}</p>
            </article>
            <article className="rounded-[8px] border border-white/10 bg-white/[0.045] p-3">
              <MapPin size={17} className="text-signal-violet" aria-hidden="true" />
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{copy.detail.coordinates}</p>
              <p className="mt-1 text-sm font-semibold text-white">{latitude}</p>
              <p className="text-sm font-semibold text-white">{longitude}</p>
            </article>
            <article className="rounded-[8px] border border-white/10 bg-white/[0.045] p-3">
              <Waves size={17} className="text-signal-orange" aria-hidden="true" />
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{copy.detail.tsunamiFlag}</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {quake.tsunami ? copy.detail.tsunamiFlagActive : copy.detail.tsunamiFlagInactive}
              </p>
            </article>
          </section>

          {quake.tsunami && (
            <section className="mt-5 rounded-[8px] border border-signal-orange/30 bg-signal-orange/10 p-4">
              <div className="flex gap-3">
                <Waves size={18} className="mt-0.5 shrink-0 text-signal-orange" aria-hidden="true" />
                <div>
                  <h3 className="text-sm font-semibold text-white">{copy.detail.tsunamiFlagActive}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{copy.detail.tsunamiFlagNote}</p>
                </div>
              </div>
            </section>
          )}

          <section className="mt-5 rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
            <h3 className="text-sm font-semibold text-white">{copy.detail.metadata}</h3>
            <dl className="mt-2">
              <DetailRow label={copy.detail.originTime} value={formatDateTime(quake.time, copy.locale)} />
              <DetailRow label={copy.detail.updated} value={formatDateTime(quake.updated, copy.locale)} />
              <DetailRow label={copy.detail.status} value={quake.status} />
              <DetailRow label={copy.detail.alert} value={quake.alert ?? copy.detail.noAlert} />
              <DetailRow label={copy.detail.magnitudeType} value={quake.magnitudeType ?? copy.notAvailable} />
              <DetailRow
                label={copy.detail.feltReports}
                value={quake.felt === null ? copy.notAvailable : formatNumber(quake.felt, copy.locale)}
              />
              <DetailRow label={copy.detail.significance} value={formatNumber(quake.significance, copy.locale)} />
              <DetailRow label={copy.detail.latitude} value={latitude} />
              <DetailRow label={copy.detail.longitude} value={longitude} />
            </dl>
          </section>
        </div>

        <div className="border-t border-white/10 p-5">
          <a
            href={quake.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[8px] border border-signal-green/30 bg-signal-green/15 px-4 text-sm font-semibold text-signal-green transition hover:border-signal-green/50 hover:bg-signal-green/20 hover:text-white"
          >
            {copy.detail.usgsEvent}
            <ExternalLink size={16} aria-hidden="true" />
          </a>
        </div>
      </aside>
    </div>
  );
}
