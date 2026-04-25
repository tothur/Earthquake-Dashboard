import { ExternalLink, PanelRightOpen, RadioTower, Waves } from 'lucide-react';
import type { DashboardCopy } from '../i18n';
import type { Earthquake, TsunamiAlert, TsunamiAlertLevel, TsunamiProduct } from '../types';
import { formatDateTime, formatMagnitude, formatNumber } from '../utils/format';
import { TSUNAMI_WARNING_CENTER_URL } from '../utils/tsunami';

interface TsunamiStatusProps {
  quakes: Earthquake[];
  alerts: TsunamiAlert[];
  products: TsunamiProduct[];
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  feedLabel: string;
  copy: DashboardCopy;
  isLoading: boolean;
  onQuakeSelect: (quake: Earthquake) => void;
}

function alertTone(level: TsunamiAlertLevel): string {
  if (level === 'warning') {
    return 'border-signal-red/30 bg-signal-red/10 text-signal-red';
  }

  if (level === 'advisory') {
    return 'border-signal-orange/30 bg-signal-orange/10 text-signal-orange';
  }

  if (level === 'watch') {
    return 'border-signal-amber/30 bg-signal-amber/10 text-signal-amber';
  }

  return 'border-signal-green/25 bg-signal-green/10 text-signal-green';
}

function ProductMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-white/10 bg-ink-900/70 px-3 py-2">
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function ProductSection({ label, value }: { label: string; value: string | null }) {
  if (!value) {
    return null;
  }

  return (
    <div className="rounded-[8px] border border-white/10 bg-ink-900/60 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm leading-6 text-slate-200">{value}</p>
    </div>
  );
}

export function TsunamiStatus({
  quakes,
  alerts,
  products,
  status,
  error,
  feedLabel,
  copy,
  isLoading,
  onQuakeSelect,
}: TsunamiStatusProps) {
  const flaggedQuakes = quakes.filter((quake) => quake.tsunami);
  const hasFlaggedEvents = flaggedQuakes.length > 0;
  const hasActiveAlerts = alerts.length > 0;
  const latestProduct = products[0] ?? null;
  const flaggedCountLabel = formatNumber(flaggedQuakes.length, copy.locale);

  if (isLoading || (status === 'loading' && products.length === 0)) {
    return (
      <section className="rounded-[8px] border border-white/10 bg-white/[0.045] p-4 shadow-panel">
        <div className="h-4 w-56 animate-pulse rounded bg-white/10" />
        <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-white/10" />
        <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-white/10" />
      </section>
    );
  }

  return (
    <section
      className={`rounded-[8px] border p-4 shadow-panel ${
        hasActiveAlerts ? 'border-signal-orange/30 bg-signal-orange/10' : 'border-white/10 bg-white/[0.045]'
      }`}
      role="status"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-[8px] border border-signal-green/25 bg-signal-green/10 px-3 py-1 text-sm font-semibold text-signal-green">
            <Waves size={16} aria-hidden="true" />
            {copy.tsunami.title}
          </div>
          <h2 className="mt-3 text-xl font-semibold text-white">
            {latestProduct ? latestProduct.headline : copy.tsunami.productEmptyTitle}
          </h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
            {latestProduct?.threatForecast ?? latestProduct?.evaluation ?? copy.tsunami.productEmptyBody}
          </p>
          <p className="mt-2 max-w-4xl text-xs leading-5 text-slate-500">{copy.tsunami.disclaimer}</p>
        </div>

        <a
          href={TSUNAMI_WARNING_CENTER_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit shrink-0 items-center gap-1.5 text-sm font-semibold text-signal-green transition hover:text-white"
        >
          {copy.tsunami.warningCenter}
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      </div>

      {status === 'error' && (
        <div className="mt-4 rounded-[8px] border border-signal-amber/30 bg-signal-amber/10 px-3 py-2 text-sm text-slate-300">
          <span className="font-semibold text-white">{copy.tsunami.alertFeedUnavailable}</span>{' '}
          {error ?? copy.tsunami.alertFeedFallback}
        </div>
      )}

      {latestProduct && (
        <div className="mt-4 border-t border-white/10 pt-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">{copy.tsunami.latestProduct}</p>
              <p className="mt-1 text-xs text-slate-500">{latestProduct.productName}</p>
            </div>
            <div className="grid gap-2 text-sm sm:grid-cols-3 lg:min-w-[520px]">
              <ProductMetric label={copy.tsunami.issued} value={formatDateTime(Date.parse(latestProduct.issuanceTime), copy.locale)} />
              <ProductMetric label={copy.tsunami.sourceOffice} value={latestProduct.issuingOffice} />
              <ProductMetric label={copy.tsunami.messageNumber} value={latestProduct.messageNumber ?? latestProduct.wmoCollectiveId} />
            </div>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <ProductSection label={copy.tsunami.earthquake} value={latestProduct.earthquakeSummary} />
            <ProductSection label={copy.tsunami.evaluation} value={latestProduct.evaluation} />
            <ProductSection label={copy.tsunami.threatForecast} value={latestProduct.threatForecast} />
            <ProductSection label={copy.tsunami.recommendedActions} value={latestProduct.recommendedAction} />
            <ProductSection label={copy.tsunami.observedWave} value={latestProduct.observation} />
          </div>

          <div className="mt-3">
            <a
              href={latestProduct.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-signal-green/30 bg-signal-green/15 px-3 text-sm font-semibold text-signal-green transition hover:border-signal-green/50 hover:bg-signal-green/20 hover:text-white"
            >
              {copy.tsunami.openProduct}
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      )}

      {products.length > 1 && (
        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="text-sm font-semibold text-white">{copy.tsunami.recentProducts}</p>
          <div className="mt-3 grid gap-2 lg:grid-cols-2">
            {products.slice(1).map((product) => (
              <a
                key={product.id}
                href={product.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-[8px] border border-white/10 bg-ink-900/70 px-3 py-3 text-left transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                <span className="block text-sm font-semibold leading-5 text-white">{product.headline}</span>
                <span className="mt-2 block text-xs text-slate-500">
                  {formatDateTime(Date.parse(product.issuanceTime), copy.locale)} · {product.issuingOffice}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {hasActiveAlerts && (
        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="text-sm font-semibold text-white">{copy.tsunami.activeAlertList}</p>
          <div className="mt-3 grid gap-2 lg:grid-cols-2">
            {alerts.slice(0, 4).map((alert) => (
              <a
                key={alert.id}
                href={alert.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-[8px] border border-white/10 bg-ink-900/70 px-3 py-3 text-left transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                <span className={`inline-flex rounded-[8px] border px-2 py-0.5 text-xs font-bold ${alertTone(alert.level)}`}>
                  {alert.event}
                </span>
                <span className="mt-2 block text-sm font-semibold leading-5 text-white">{alert.headline}</span>
                <span className="mt-2 block max-h-10 overflow-hidden text-xs leading-5 text-slate-400">{alert.area}</span>
                <span className="mt-2 block text-xs text-slate-500">
                  {copy.tsunami.expires}: {alert.expires ? formatDateTime(Date.parse(alert.expires), copy.locale) : copy.notAvailable}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {hasFlaggedEvents && (
        <div className="mt-4 border-t border-white/10 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-white">{copy.tsunami.reviewFlaggedEvents}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{copy.tsunami.usgsFlagContext(feedLabel)}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <RadioTower size={13} aria-hidden="true" />
              {copy.tsunami.usgsFlagSummary(flaggedCountLabel)}
            </div>
          </div>
          <div className="mt-3 grid gap-2 lg:grid-cols-3">
            {flaggedQuakes.slice(0, 3).map((quake) => (
              <button
                key={quake.id}
                type="button"
                onClick={() => onQuakeSelect(quake)}
                className="flex min-w-0 items-start justify-between gap-3 rounded-[8px] border border-white/10 bg-ink-900/70 px-3 py-2 text-left transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-white">{quake.place}</span>
                  <span className="mt-1 block text-xs text-slate-400">{formatDateTime(quake.time, copy.locale)}</span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-signal-orange">
                  {formatMagnitude(quake.magnitude, copy.locale, copy.pendingMagnitude)}
                  <PanelRightOpen size={14} aria-hidden="true" />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
