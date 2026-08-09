# bus-service

A small real-time bus arrivals service used as a development playground. It has two
workspaces managed with npm workspaces:

- **`server/`** — a TypeScript [Express](https://expressjs.com/) API that serves bus
  routes, stops, and live (simulated) arrival predictions.
- **`web/`** — a [React](https://react.dev/) + [Vite](https://vitejs.dev/) single-page
  app that renders a live arrivals board and polls the API.

## Requirements

- Node.js >= 20 (the repo is developed against Node 22)
- npm (comes with Node)

## Getting started

```bash
npm ci        # install all workspace dependencies
npm run dev   # start the API (:4000) and the web app (:5173) together
```

Then open http://localhost:5173. The Vite dev server proxies `/api/*` to the API on
port 4000, so both run behind a single origin during development.

You can also run each side on its own:

```bash
npm run dev:server   # API only, http://localhost:4000
npm run dev:web      # web only, http://localhost:5173
```

## API

| Method | Path                          | Description                                   |
| ------ | ----------------------------- | --------------------------------------------- |
| GET    | `/api/health`                 | Liveness probe.                               |
| GET    | `/api/routes`                 | All bus routes.                               |
| GET    | `/api/routes/:routeId`        | One route plus its resolved stops.            |
| GET    | `/api/stops`                  | All stops.                                    |
| GET    | `/api/stops/:stopId/arrivals` | Live upcoming arrivals for a stop.            |

Example:

```bash
curl http://localhost:4000/api/stops/central/arrivals
```

Arrival predictions come from a deterministic timetable model (`server/src/arrivals.ts`),
so they count down in real time yet remain a pure function of the current clock — which
keeps them easy to unit test.

## Common scripts

Run from the repository root:

```bash
npm run build       # type-check + build server and web
npm run lint        # eslint across both workspaces
npm run typecheck   # tsc --noEmit across both workspaces
npm test            # run the server test suite (vitest)
```

## Project layout

```
server/   Express + TypeScript API (routes, stops, arrivals) with vitest tests
web/      React + Vite front-end (live arrivals board)
```
