import type {
  NwsAlertFeatureCollection,
  NwsProductCollection,
  NwsProductDetail,
  NwsProductSummary,
  TsunamiAlert,
  TsunamiAlertLevel,
  TsunamiProduct,
  TsunamiProductEarthquake,
} from '../types';

const NWS_TSUNAMI_ALERT_URL =
  'https://api.weather.gov/alerts/active?event=Tsunami%20Warning,Tsunami%20Advisory,Tsunami%20Watch,Tsunami%20Information%20Statement&status=actual';
const NWS_TSUNAMI_PRODUCT_URL = 'https://api.weather.gov/products/types/TSU';

export const TSUNAMI_ALERT_SOURCE_URL = NWS_TSUNAMI_PRODUCT_URL;
export const TSUNAMI_WARNING_CENTER_URL = 'https://www.tsunami.gov/';

export interface TsunamiAlertLoadResult {
  alerts: TsunamiAlert[];
  products: TsunamiProduct[];
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

function cleanProductLine(value: string): string {
  return value.replace(/\s+/g, ' ').replace(/\.\.\./g, '...').trim();
}

function isSectionHeading(line: string, nextLine: string): boolean {
  return /^[A-Z0-9][A-Z0-9 .,/()-]{3,}$/.test(line) && /^-+$/.test(nextLine);
}

function compactSectionLines(lines: string[]): string[] {
  const items: string[] = [];

  lines.forEach((line) => {
    const cleanLine = cleanProductLine(line.replace(/^\*\s*/, ''));
    if (!cleanLine || /^NOTICE\b/.test(cleanLine)) {
      return;
    }

    if (line.trim().startsWith('*') || items.length === 0) {
      items.push(cleanLine);
      return;
    }

    items[items.length - 1] = `${items[items.length - 1]} ${cleanLine}`;
  });

  return items;
}

function extractSectionItems(productText: string, heading: string): string[] {
  const lines = productText.split(/\r?\n/);
  const headingIndex = lines.findIndex((line) => line.trim().startsWith(heading));

  if (headingIndex === -1) {
    return [];
  }

  const sectionLines: string[] = [];

  for (let index = headingIndex + 1; index < lines.length; index += 1) {
    const line = lines[index].trim();
    const nextLine = lines[index + 1]?.trim() ?? '';

    if (sectionLines.length > 0 && isSectionHeading(line, nextLine)) {
      break;
    }

    if (!line || /^-+$/.test(line)) {
      continue;
    }

    sectionLines.push(line);
  }

  return compactSectionLines(sectionLines);
}

function extractHeadline(productText: string, fallback: string): string {
  const headline = productText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => /^\.\.\..+\.\.\.$/.test(line));

  return headline ? cleanProductLine(headline.replace(/^\.\.\./, '').replace(/\.\.\.$/, '')) : fallback;
}

function extractMessageNumber(productText: string): string | null {
  const messageNumber = productText.match(/TSUNAMI MESSAGE NUMBER\s+\d+/i)?.[0];
  return messageNumber ? cleanProductLine(messageNumber) : null;
}

function extractObservation(productText: string): string | null {
  const observationLine = productText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => /\d+\.\d+M\/\s*\d+\.\d+FT/.test(line));

  return observationLine ? cleanProductLine(observationLine) : null;
}

function parseNoaaTime(value: string): number | null {
  const match = value.match(/(\d{2})(\d{2})\s+UTC\s+([A-Z]{3})\s+(\d{1,2})\s+(\d{4})/i);
  if (!match) {
    return null;
  }

  const month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].indexOf(
    match[3].toUpperCase(),
  );

  if (month === -1) {
    return null;
  }

  return Date.UTC(Number(match[5]), month, Number(match[4]), Number(match[1]), Number(match[2]));
}

function parseHemisphereCoordinate(value: string, negativeHemisphere: string): number {
  const [amount, hemisphere] = value.trim().split(/\s+/);
  const parsedAmount = Number(amount);
  return hemisphere.toUpperCase().startsWith(negativeHemisphere) ? -parsedAmount : parsedAmount;
}

function parseProductEarthquake(productText: string): TsunamiProductEarthquake | null {
  const items = extractSectionItems(productText, 'PRELIMINARY EARTHQUAKE PARAMETERS');
  if (items.length === 0) {
    return null;
  }

  const findValue = (label: string) => {
    const item = items.find((line) => line.toUpperCase().startsWith(label));
    return item?.replace(new RegExp(`^${label}\\s*`, 'i'), '').trim() ?? null;
  };

  const magnitude = Number(findValue('MAGNITUDE') ?? Number.NaN);
  const coordinates = findValue('COORDINATES')?.match(/([\d.]+\s+(?:NORTH|SOUTH))\s+([\d.]+\s+(?:EAST|WEST))/i);
  const depthKm = findValue('DEPTH')?.match(/([\d.]+)\s*KM/i)?.[1];

  return {
    magnitude: Number.isFinite(magnitude) ? magnitude : null,
    originTime: findValue('ORIGIN TIME') ? parseNoaaTime(findValue('ORIGIN TIME') ?? '') : null,
    latitude: coordinates ? parseHemisphereCoordinate(coordinates[1], 'S') : null,
    longitude: coordinates ? parseHemisphereCoordinate(coordinates[2], 'W') : null,
    depthKm: depthKm ? Number(depthKm) : null,
    location: findValue('LOCATION'),
  };
}

function parseProductDetail(detail: NwsProductDetail): TsunamiProduct {
  const productText = detail.productText ?? '';
  const earthquakeItems = extractSectionItems(productText, 'PRELIMINARY EARTHQUAKE PARAMETERS');
  const evaluationItems = extractSectionItems(productText, 'EVALUATION');
  const threatItems = extractSectionItems(productText, 'TSUNAMI THREAT FORECAST');
  const actionItems = extractSectionItems(productText, 'RECOMMENDED ACTIONS');

  return {
    id: detail.id,
    wmoCollectiveId: detail.wmoCollectiveId ?? 'Unknown',
    issuingOffice: detail.issuingOffice ?? 'Unknown',
    issuanceTime: detail.issuanceTime ?? new Date().toISOString(),
    productName: detail.productName ?? 'Tsunami product',
    headline: extractHeadline(productText, detail.productName ?? 'Tsunami product'),
    messageNumber: extractMessageNumber(productText),
    earthquake: parseProductEarthquake(productText),
    earthquakeSummary: earthquakeItems.slice(0, 4).join(' • ') || null,
    evaluation: evaluationItems.slice(0, 2).join(' ') || null,
    threatForecast: threatItems[0] ?? null,
    recommendedAction: actionItems[0] ?? null,
    observation: extractObservation(productText),
    sourceUrl: `https://api.weather.gov/products/${detail.id}`,
  };
}

async function fetchActiveTsunamiAlerts(signal: AbortSignal): Promise<TsunamiAlert[]> {
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

  return alerts.sort((first, second) => {
    const firstTime = parseTime(first.sent) ?? 0;
    const secondTime = parseTime(second.sent) ?? 0;
    return secondTime - firstTime;
  });
}

async function fetchRecentTsunamiProducts(signal: AbortSignal): Promise<TsunamiProduct[]> {
  const response = await fetch(NWS_TSUNAMI_PRODUCT_URL, {
    signal,
    cache: 'no-store',
    headers: {
      Accept: 'application/ld+json',
    },
  });

  if (!response.ok) {
    throw new Error(`NOAA/NWS returned HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as NwsProductCollection;
  const summaries = (payload['@graph'] ?? []).slice(0, 3);
  const details = await Promise.all(summaries.map((summary) => fetchTsunamiProductDetail(summary, signal)));

  return details.map(parseProductDetail).sort((first, second) => {
    const firstTime = parseTime(first.issuanceTime) ?? 0;
    const secondTime = parseTime(second.issuanceTime) ?? 0;
    return secondTime - firstTime;
  });
}

async function fetchTsunamiProductDetail(summary: NwsProductSummary, signal: AbortSignal): Promise<NwsProductDetail> {
  const response = await fetch(summary['@id'], {
    signal,
    cache: 'no-store',
    headers: {
      Accept: 'application/ld+json',
    },
  });

  if (!response.ok) {
    throw new Error(`NOAA/NWS returned HTTP ${response.status}.`);
  }

  return (await response.json()) as NwsProductDetail;
}

export async function fetchTsunamiInfo(signal: AbortSignal): Promise<TsunamiAlertLoadResult> {
  const [alertsResult, productsResult] = await Promise.allSettled([
    fetchActiveTsunamiAlerts(signal),
    fetchRecentTsunamiProducts(signal),
  ]);

  if (productsResult.status === 'rejected') {
    throw productsResult.reason instanceof Error
      ? productsResult.reason
      : new Error('Unable to load recent NOAA/NWS tsunami products.');
  }

  return {
    alerts: alertsResult.status === 'fulfilled' ? alertsResult.value : [],
    products: productsResult.value,
  };
}
