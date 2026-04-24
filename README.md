# Earthquake Tracker Dashboard

A single-page, production-ready earthquake monitoring dashboard built with Vite, React, TypeScript, Tailwind CSS, and Leaflet. It fetches official USGS Earthquake Hazards Program GeoJSON feeds directly in the browser and requires no backend server.

## Features

- Interactive global Leaflet map with magnitude-scaled markers.
- USGS popup details for location, magnitude, depth, event time, and source link.
- Past hour, past day, and past week feed selector.
- Minimum magnitude filter.
- Magnitude 7+ highlight panel with graceful empty state.
- Summary cards for total displayed earthquakes, strongest event, most recent event, M5+, and M6+ counts.
- Sortable recent-earthquakes table.
- Loading, empty, and feed-error states.
- Static-site deployment configuration for GitHub Pages.

## Data Source

The app uses official USGS GeoJSON feeds:

- Past hour: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson`
- Past day: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson`
- Past week: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson`

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
- The dashboard handles temporary USGS feed errors without crashing.
- The M7+ panel is based on the selected time range feed, independent of the minimum magnitude filter.
