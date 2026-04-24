import type { NwsAlertFeatureCollection, TsunamiAlert, TsunamiAlertLevel } from '../types';

const NWS_TSUNAMI_ALERT_URL =
  'https://api.weather.gov/alerts/active?event=Tsunami%20Warning,Tsunami%20Advisory,Tsunami%20Watch,Tsunami%20Information%20Statement&status=actual';

export const TSUNAMI_ALERT_SOURCE_URL = NWS_TSUNAMI_ALERT_URL;
export const TSUNAMI_WARNING_CENTER_URL = 'https://www.tsunami.gov/';

export interface TsunamiAlertLoadResult {
  alerts: TsunamiAlert[];
  updatedAt: number | null;
}

function alertLevel(event: string): TsunamiAlertLevel {
  const normalizedEvent = event.toLocaleLowerCase();

  if (normalizedEvent.includes('warning')) {
    return 'warning';
  }

  if (normalizedEvent.includes('advisory')) {
    return 'advisory';
  }

  if (normalizedEvent.includes('watch')) {
    return 'watch';
  }

  if (normalizedEvent.includes('statement')) {
    return 'statement';
  }

  return 'other';
}

function parseTime(value: string | undefined | null): number | null {
  if (!value) {
    return null;
  }

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

export async function fetchTsunamiAlerts(signal: AbortSignal): Promise<TsunamiAlertLoadResult> {
  const response = await fetch(NWS_TSUNAMI_ALERT_URL, {
    signal,
    cache: 'no-store',
    headers: {
      Accept: 'application/geo+json',
    },
  });

  if (!response.ok) {
    throw new Error(`NOAA/NWS returned HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as NwsAlertFeatureCollection;
  const alerts = payload.features.map((feature) => {
    const properties = feature.properties;
    const event = properties.event ?? 'Tsunami alert';
    const headline = properties.headline ?? event;
    const url = properties.web ?? properties['@id'] ?? feature.id ?? TSUNAMI_WARNING_CENTER_URL;

    return {
      id: properties['@id'] ?? properties.id ?? feature.id ?? `${event}:${properties.sent ?? headline}`,
      level: alertLevel(event),
      event,
      headline,
      area: properties.areaDesc ?? 'Area unavailable',
      severity: properties.severity ?? 'Unknown',
      urgency: properties.urgency ?? 'Unknown',
      certainty: properties.certainty ?? 'Unknown',
      status: properties.status ?? 'Unknown',
      messageType: properties.messageType ?? 'Unknown',
      sent: properties.sent ?? null,
      effective: properties.effective ?? null,
      expires: properties.expires ?? null,
      description: properties.description ?? '',
      instruction: properties.instruction ?? null,
      url,
      geometry: feature.geometry,
    } satisfies TsunamiAlert;
  });

  return {
    alerts: alerts.sort((first, second) => {
      const firstTime = parseTime(first.sent) ?? 0;
      const secondTime = parseTime(second.sent) ?? 0;
      return secondTime - firstTime;
    }),
    updatedAt: Date.now(),
  };
}
