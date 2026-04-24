import type { FeedDefinition } from '../types';

export const FEEDS: FeedDefinition[] = [
  {
    id: 'hour',
    label: 'Past hour',
    shortLabel: '1H',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson',
    description: 'All USGS-listed earthquakes from the last hour.',
  },
  {
    id: 'day',
    label: 'Past day',
    shortLabel: '24H',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
    description: 'All USGS-listed earthquakes from the last 24 hours.',
  },
  {
    id: 'week',
    label: 'Past week',
    shortLabel: '7D',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson',
    description: 'All USGS-listed earthquakes from the last 7 days.',
  },
];

export const MIN_MAGNITUDE_OPTIONS = [0, 1, 2.5, 4, 5, 6, 7];

export const MAJOR_MAGNITUDE_OPTIONS = [5, 5.5, 6, 6.5, 7, 7.5, 8];
