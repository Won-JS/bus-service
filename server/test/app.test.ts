import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('bus-service API', () => {
  it('reports health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('lists routes and stops', async () => {
    const routes = await request(app).get('/api/routes');
    expect(routes.status).toBe(200);
    expect(routes.body.routes.length).toBeGreaterThan(0);

    const stops = await request(app).get('/api/stops');
    expect(stops.status).toBe(200);
    expect(stops.body.stops.length).toBeGreaterThan(0);
  });

  it('returns route detail with resolved stops', async () => {
    const res = await request(app).get('/api/routes/red');
    expect(res.status).toBe(200);
    expect(res.body.route.id).toBe('red');
    expect(res.body.stops[0]).toHaveProperty('name');
  });

  it('404s for an unknown route', async () => {
    const res = await request(app).get('/api/routes/purple');
    expect(res.status).toBe(404);
  });

  it('returns live arrivals sorted soonest first', async () => {
    const res = await request(app).get('/api/stops/central/arrivals');
    expect(res.status).toBe(200);
    expect(res.body.arrivals.length).toBeGreaterThan(0);
    const minutes = res.body.arrivals.map((a: { minutesAway: number }) => a.minutesAway);
    const sorted = [...minutes].sort((a, b) => a - b);
    expect(minutes).toEqual(sorted);
  });

  it('404s for an unknown stop', async () => {
    const res = await request(app).get('/api/stops/nowhere/arrivals');
    expect(res.status).toBe(404);
  });
});
