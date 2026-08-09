import { useCallback, useEffect, useState } from 'react';
import {
  fetchArrivals,
  fetchRoutes,
  fetchStops,
  type Arrival,
  type Route,
  type Stop,
} from './api.js';

const REFRESH_MS = 5000;

function formatEta(minutesAway: number): string {
  if (minutesAway <= 0) return 'Due';
  if (minutesAway === 1) return '1 min';
  return `${minutesAway} min`;
}

export default function App() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedStop, setSelectedStop] = useState<string | null>(null);
  const [arrivals, setArrivals] = useState<Arrival[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchStops(), fetchRoutes()])
      .then(([stopsRes, routesRes]) => {
        setStops(stopsRes.stops);
        setRoutes(routesRes.routes);
        setSelectedStop((current) => current ?? stopsRes.stops[0]?.id ?? null);
      })
      .catch((err: unknown) => setError(String(err)));
  }, []);

  const loadArrivals = useCallback((stopId: string) => {
    fetchArrivals(stopId)
      .then((res) => {
        setArrivals(res.arrivals);
        setUpdatedAt(res.generatedAt);
        setError(null);
      })
      .catch((err: unknown) => setError(String(err)));
  }, []);

  useEffect(() => {
    if (!selectedStop) return;
    loadArrivals(selectedStop);
    const timer = setInterval(() => loadArrivals(selectedStop), REFRESH_MS);
    return () => clearInterval(timer);
  }, [selectedStop, loadArrivals]);

  return (
    <div className="app">
      <header className="hero">
        <div className="hero__badge">🚌 bus-service</div>
        <h1>Live Arrivals Board</h1>
        <p>Pick a stop to see the next buses rolling in, refreshed automatically.</p>
      </header>

      {error && <div className="banner banner--error">{error}</div>}

      <main className="layout">
        <section className="panel">
          <h2 className="panel__title">Stops</h2>
          <ul className="stop-list">
            {stops.map((stop) => (
              <li key={stop.id}>
                <button
                  type="button"
                  className={
                    'stop-list__item' +
                    (stop.id === selectedStop ? ' stop-list__item--active' : '')
                  }
                  onClick={() => setSelectedStop(stop.id)}
                >
                  <span className="stop-list__name">{stop.name}</span>
                  <span className="stop-list__coords">
                    {stop.lat.toFixed(3)}, {stop.lon.toFixed(3)}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <h2 className="panel__title">Routes</h2>
          <ul className="route-legend">
            {routes.map((route) => (
              <li key={route.id} className="route-legend__item">
                <span className="dot" style={{ backgroundColor: route.color }} />
                <span>{route.name}</span>
                <span className="route-legend__headway">every {route.headwayMinutes}m</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel panel--board">
          <div className="board__header">
            <h2 className="panel__title">
              Next arrivals
              {selectedStop && (
                <span className="board__stop">
                  {stops.find((s) => s.id === selectedStop)?.name}
                </span>
              )}
            </h2>
            {updatedAt && (
              <span className="board__updated">
                updated {new Date(updatedAt).toLocaleTimeString()}
              </span>
            )}
          </div>

          {arrivals.length === 0 ? (
            <p className="board__empty">No upcoming arrivals.</p>
          ) : (
            <ul className="arrivals">
              {arrivals.map((arrival, index) => (
                <li className="arrival" key={`${arrival.routeId}-${index}`}>
                  <span
                    className="arrival__route"
                    style={{ backgroundColor: arrival.routeColor }}
                  >
                    {arrival.routeId.toUpperCase()}
                  </span>
                  <span className="arrival__name">{arrival.routeName}</span>
                  <span className="arrival__eta" data-due={arrival.minutesAway <= 0}>
                    {formatEta(arrival.minutesAway)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
