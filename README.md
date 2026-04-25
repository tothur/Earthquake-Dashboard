# Earthquake Tracker Dashboard

A single-page, production-ready earthquake monitoring dashboard built with Vite, React, TypeScript, Tailwind CSS, and Leaflet. It fetches official USGS Earthquake Hazards Program GeoJSON feeds directly in the browser and requires no backend server.

## Features

- Interactive global Leaflet map with magnitude-scaled clustered markers.
- Toggleable tectonic context overlay with PB2002 plate boundaries and subduction zones.
- NOAA/NWS tsunami-center products with parsed threat, evaluation, action, and observation details, plus optional active-alert map polygons when available.
- Event detail side panel with USGS metadata, coordinates, depth, status, and alert information.
- Past hour, past day, and past week feed selector.
- Minimum magnitude filter.
- Configurable major-earthquake highlight panel with graceful empty state.
- Summary cards for total displayed earthquakes, strongest event, most recent event, closest event to Hungary, and M6+ counts.
- Earthquake timeline and magnitude distribution chart.
- Sortable recent-earthquakes table.
- English and Hungarian interface with light, dark, and automatic theme modes.
- Loading, empty, and feed-error states.
- Static-site deployment configuration for GitHub Pages.

## Data Source

The app uses official USGS GeoJSON feeds:

- Past hour: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson`
- Past day: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson`
- Past week: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson`

The tectonic context layer uses a bundled static copy of the PB2002 plate-boundary GeoJSON dataset from `fraxen/tectonicplates`, stored at `public/data/tectonic-boundaries.geojson` so the deployed app does not depend on GitHub raw content at runtime.

Tsunami information uses two levels of context:

- The USGS earthquake `tsunami` event flag from the selected GeoJSON feed.
- Recent NOAA/NWS tsunami-center products from `https://api.weather.gov/products/types/TSU`.
- Active NOAA/NWS tsunami alert polygons, when available, from `https://api.weather.gov/alerts/active?event=Tsunami%20Warning,Tsunami%20Advisory,Tsunami%20Watch,Tsunami%20Information%20Statement&status=actual`.

The dashboard links back to `https://www.tsunami.gov/` for official warning-center messages. It is a monitoring aid only and does not replace civil-protection instructions or official tsunami warning center guidance.

## Local Development

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173/`.

## Production Build

```bash
npm run build
```

The static output is written to `dist/`.

To preview the production build locally:

```bash
npm run preview
```

## GitHub Pages Deployment

This project is configured for a GitHub Pages project site named `Earthquake-Dashboard`.

The production base path is set in `vite.config.ts`:

```ts
base: mode === 'production' ? '/Earthquake-Dashboard/' : '/',
```

If your GitHub repository uses a different name, replace `Earthquake-Dashboard` with that repository name before deploying.

### Create and Push the Repository

```bash
git init
git add .
git commit -m "Build earthquake tracker dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Earthquake-Dashboard.git
git push -u origin main
```

### Enable GitHub Pages

1. Open the repository on GitHub.
2. Go to **Settings**.
3. Select **Pages** from the sidebar.
4. Under **Build and deployment**, set **Source** to **GitHub Actions**.
5. Push to `main` or run the `Deploy to GitHub Pages` workflow manually.
6. Open the deployed site from the Pages URL shown in the workflow summary or Settings > Pages.

## Notes

- All API calls are client-side.
- The dashboard handles temporary USGS and NOAA/NWS feed errors without crashing.
- The major-earthquake panel is based on the selected time range feed, independent of the minimum magnitude filter.
