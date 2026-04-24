import type { Earthquake, SortState, UsgsFeature, UsgsFeatureCollection } from '../types';

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

export function parseEarthquakes(payload: UsgsFeatureCollection): Earthquake[] {
  if (!Array.isArray(payload.features)) {
    throw new Error('USGS response did not include a features array.');
  }

  return payload.features
    .filter((feature) => isEarthquakeFeature(feature))
    .map((feature) => {
      const [longitude, latitude, depthKm] = feature.geometry.coordinates;
      return {
        id: feature.id,
        magnitude: isFiniteNumber(feature.properties.mag) ? feature.properties.mag : null,
        place: feature.properties.place?.trim() || 'Location pending',
        time: feature.properties.time,
        updated: feature.properties.updated,
        url: feature.properties.url,
        depthKm: isFiniteNumber(depthKm) ? depthKm : 0,
        latitude,
        longitude,
        alert: feature.properties.alert,
        felt: feature.properties.felt,
        tsunami: feature.properties.tsunami === 1,
        significance: feature.properties.sig,
        status: feature.properties.status,
        magnitudeType: feature.properties.magType,
      };
    })
    .filter((quake) => isFiniteNumber(quake.latitude) && isFiniteNumber(quake.longitude))
    .sort((a, b) => b.time - a.time);
}

function isEarthquakeFeature(feature: UsgsFeature): boolean {
  return (
    feature?.type === 'Feature' &&
    feature.geometry?.type === 'Point' &&
    Array.isArray(feature.geometry.coordinates) &&
    feature.geometry.coordinates.length >= 2 &&
    (!feature.properties?.type ||
      feature.properties.type.toLocaleLowerCase() === 'earthquake')
  );
}

export function applyMinimumMagnitude(quakes: Earthquake[], minimumMagnitude: number): Earthquake[] {
  if (minimumMagnitude <= 0) {
    return quakes;
  }

  return quakes.filter((quake) => (quake.magnitude ?? Number.NEGATIVE_INFINITY) >= minimumMagnitude);
}

export function getStrongest(quakes: Earthquake[]): Earthquake | null {
  return quakes.reduce<Earthquake | null>((strongest, quake) => {
    if (quake.magnitude === null) {
      return strongest;
    }

    if (!strongest || strongest.magnitude === null || quake.magnitude > strongest.magnitude) {
      return quake;
    }

    if (quake.magnitude === strongest.magnitude && quake.time > strongest.time) {
      return quake;
    }

    return strongest;
  }, null);
}

export function getMostRecent(quakes: Earthquake[]): Earthquake | null {
  return quakes.reduce<Earthquake | null>((recent, quake) => {
    if (!recent || quake.time > recent.time) {
      return quake;
    }

    return recent;
  }, null);
}

export function getLargestM7Plus(quakes: Earthquake[]): Earthquake | null {
  return getStrongest(quakes.filter((quake) => (quake.magnitude ?? 0) >= 7));
}

export function countAtLeast(quakes: Earthquake[], magnitude: number): number {
  return quakes.filter((quake) => (quake.magnitude ?? Number.NEGATIVE_INFINITY) >= magnitude).length;
}

export function sortEarthquakes(quakes: Earthquake[], sortState: SortState): Earthquake[] {
  const multiplier = sortState.direction === 'asc' ? 1 : -1;

  return [...quakes].sort((a, b) => {
    if (sortState.key === 'place') {
      return a.place.localeCompare(b.place) * multiplier;
    }

    const aValue = getSortableNumber(a, sortState.key);
    const bValue = getSortableNumber(b, sortState.key);
    return (aValue - bValue) * multiplier;
  });
}

function getSortableNumber(quake: Earthquake, key: Exclude<SortState['key'], 'place'>): number {
  if (key === 'magnitude') {
    return quake.magnitude ?? Number.NEGATIVE_INFINITY;
  }

  return quake[key];
}

export function magnitudeTone(magnitude: number | null): {
  color: string;
  background: string;
  label: string;
} {
  const value = magnitude ?? 0;

  if (value >= 7) {
    return { color: '#f3b0ff', background: 'rgba(184, 108, 255, 0.28)', label: 'Major' };
  }
  if (value >= 6) {
    return { color: '#ff858e', background: 'rgba(227, 77, 89, 0.28)', label: 'Strong' };
  }
  if (value >= 5) {
    return { color: '#ffa777', background: 'rgba(242, 121, 76, 0.25)', label: 'Moderate+' };
  }
  if (value >= 4) {
    return { color: '#fbd38d', background: 'rgba(246, 182, 95, 0.22)', label: 'Light+' };
  }
  return { color: '#66e4b5', background: 'rgba(84, 214, 167, 0.18)', label: 'Minor' };
}

export function markerRadius(magnitude: number | null): number {
  const value = Math.max(magnitude ?? 0, 0);
  return Math.max(4, Math.min(24, 4 + value ** 1.75));
}
