export interface Stop {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export interface Route {
  id: string;
  name: string;
  color: string;
  headwayMinutes: number;
  travelMinutesPerStop: number;
  stopIds: string[];
}

export interface Arrival {
  routeId: string;
  routeName: string;
  routeColor: string;
  stopId: string;
  arrivalTime: string;
  minutesAway: number;
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}): ${url}`);
  }
  return res.json() as Promise<T>;
}

export function fetchStops(): Promise<{ stops: Stop[] }> {
  return getJson('/api/stops');
}

export function fetchRoutes(): Promise<{ routes: Route[] }> {
  return getJson('/api/routes');
}

export function fetchArrivals(
  stopId: string,
): Promise<{ stop: Stop; generatedAt: string; arrivals: Arrival[] }> {
  return getJson(`/api/stops/${stopId}/arrivals`);
}
