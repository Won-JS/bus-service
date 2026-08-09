import cors from 'cors';
import express, { type Express, type Request, type Response } from 'express';
import { nextArrivals } from './arrivals.js';
import { getRoute, getStop, routes, stops } from './data.js';

export function createApp(): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'bus-service', time: new Date().toISOString() });
  });

  app.get('/api/stops', (_req: Request, res: Response) => {
    res.json({ stops });
  });

  app.get('/api/routes', (_req: Request, res: Response) => {
    res.json({ routes });
  });

  app.get('/api/routes/:routeId', (req: Request, res: Response) => {
    const route = getRoute(req.params.routeId);
    if (!route) {
      res.status(404).json({ error: `Unknown route: ${req.params.routeId}` });
      return;
    }
    const routeStops = route.stopIds
      .map((id) => getStop(id))
      .filter((s): s is NonNullable<typeof s> => Boolean(s));
    res.json({ route, stops: routeStops });
  });

  // Live arrivals for every route serving a given stop, sorted soonest first.
  app.get('/api/stops/:stopId/arrivals', (req: Request, res: Response) => {
    const stop = getStop(req.params.stopId);
    if (!stop) {
      res.status(404).json({ error: `Unknown stop: ${req.params.stopId}` });
      return;
    }
    const now = new Date();
    const arrivals = routes
      .filter((route) => route.stopIds.includes(stop.id))
      .flatMap((route) => nextArrivals(route, stop.id, now))
      .sort((a, b) => a.minutesAway - b.minutesAway);

    res.json({ stop, generatedAt: now.toISOString(), arrivals });
  });

  return app;
}
