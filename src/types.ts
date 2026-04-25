import type { Geometry } from 'geojson';

export interface UsgsFeatureCollection {
  type: 'FeatureCollection';
  metadata?: {
    generated?: number;
    title?: string;
    url?: string;
    count?: number;
  };
  features: UsgsFeature[];
}

export interface UsgsFeature {
  type: 'Feature';
  id: string;
  properties: {
    mag: number | null;
    place: string | null;
    time: number;
    updated: number;
    tz: number | null;
    url: string;
    detail: string;
    felt: number | null;
    cdi: number | null;
    mmi: number | null;
    alert: string | null;
    status: string;
    tsunami: number;
    sig: number;
    net: string;
    code: string;
    ids: string;
    sources: string;
    types: string;
    nst: number | null;
    dmin: number | null;
    rms: number | null;
    gap: number | null;
    magType: string | null;
    type: string;
    title: string;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number, number];
  };
}

export interface Earthquake {
  id: string;
  magnitude: number | null;
  place: string;
  time: number;
  updated: number;
  url: string;
  depthKm: number;
  latitude: number;
  longitude: number;
  alert: string | null;
  felt: number | null;
  tsunami: boolean;
  significance: number;
  status: string;
  magnitudeType: string | null;
}

export type FeedId = 'hour' | 'day' | 'week';

export interface FeedDefinition {
  id: FeedId;
  label: string;
  shortLabel: string;
  url: string;
  description: string;
}

export type SortKey = 'time' | 'magnitude' | 'depthKm' | 'place';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  key: SortKey;
  direction: SortDirection;
}

export type TsunamiAlertLevel = 'warning' | 'advisory' | 'watch' | 'statement' | 'other';

export interface TsunamiAlert {
  id: string;
  level: TsunamiAlertLevel;
  event: string;
  headline: string;
  area: string;
  severity: string;
  urgency: string;
  certainty: string;
  status: string;
  messageType: string;
  sent: string | null;
  effective: string | null;
  expires: string | null;
  description: string;
  instruction: string | null;
  url: string;
  geometry: Geometry | null;
}

export interface TsunamiProduct {
  id: string;
  wmoCollectiveId: string;
  issuingOffice: string;
  issuanceTime: string;
  productName: string;
  headline: string;
  messageNumber: string | null;
  earthquake: TsunamiProductEarthquake | null;
  referencedQuake: Earthquake | null;
  earthquakeSummary: string | null;
  evaluation: string | null;
  threatForecast: string | null;
  recommendedAction: string | null;
  observation: string | null;
  sourceUrl: string;
}

export interface TsunamiProductEarthquake {
  magnitude: number | null;
  originTime: number | null;
  latitude: number | null;
  longitude: number | null;
  depthKm: number | null;
  location: string | null;
}

export interface NwsAlertFeatureCollection {
  type: 'FeatureCollection';
  title?: string;
  updated?: string;
  features: NwsAlertFeature[];
}

export interface NwsAlertFeature {
  id?: string;
  type: 'Feature';
  geometry: Geometry | null;
  properties: {
    '@id'?: string;
    id?: string;
    areaDesc?: string;
    sent?: string | null;
    effective?: string | null;
    expires?: string | null;
    status?: string;
    messageType?: string;
    severity?: string;
    certainty?: string;
    urgency?: string;
    event?: string;
    senderName?: string;
    headline?: string | null;
    description?: string | null;
    instruction?: string | null;
    web?: string | null;
  };
}

export interface NwsProductCollection {
  '@graph': NwsProductSummary[];
}

export interface NwsProductSummary {
  '@id': string;
  id: string;
  wmoCollectiveId?: string;
  issuingOffice?: string;
  issuanceTime?: string;
  productCode?: string;
  productName?: string;
}

export interface NwsProductDetail extends NwsProductSummary {
  productText?: string;
}
