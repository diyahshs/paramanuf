# Paramanuf — by Paragoncorp

Production monitoring dashboard for Paragon manufacturing plants.

## Tech stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Tabler Icons**

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

### Option A — GitHub + Vercel (recommended)
1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Leave all settings as default → Deploy
4. Done — every `git push` will auto-redeploy

### Option B — Vercel CLI
```bash
npm i -g vercel
vercel
```

## Project structure

```
src/
  app/
    page.tsx          # Root page — ties sidebar + pages together
    layout.tsx        # Root layout with metadata
    globals.css       # Global styles + Tabler Icons import
  components/
    Sidebar.tsx       # Left navigation sidebar
    OverviewPage.tsx  # Overview dashboard (KPI cards + energy)
    MonitoringPage.tsx# Real-time monitoring (3-column: weighing/mixing/packing)
    DateFilter.tsx    # Metabase-style date filter dropdown
  lib/
    data.ts           # Dummy data layer — replace with real SAP/FRO API calls
```

## Integrating real data

All dummy data lives in `src/lib/data.ts`. When ready to connect to SAP/FRO:

1. Replace `getOverviewData()` with a `fetch()` to your SAP OData or REST endpoint
2. Replace `MONITORING_DATA` with live data from FRO API
3. Keep the TypeScript interfaces — they define the contract your API should match

## Future enhancements (planned)
- Real-time polling / WebSocket for live monitoring updates
- Authentication (operator vs manager views)
- Export to XLSX in addition to CSV
- Notifications for breakdown alerts
- Historical trend charts on Overview
