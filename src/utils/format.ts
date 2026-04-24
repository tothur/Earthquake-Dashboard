import { formatDistanceToNowStrict } from 'date-fns';

export function formatMagnitude(magnitude: number | null): string {
  return magnitude === null ? 'Pending' : `M ${magnitude.toFixed(1)}`;
}

export function formatDepth(depthKm: number): string {
  return `${depthKm.toFixed(1)} km`;
}

export function formatDateTime(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

export function formatRelativeTime(timestamp: number): string {
  return formatDistanceToNowStrict(new Date(timestamp), { addSuffix: true });
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(undefined).format(value);
}
