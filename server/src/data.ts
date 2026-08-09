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
  /** Minutes between consecutive buses on this route. */
  headwayMinutes: number;
  /** Average minutes a bus takes to travel between two consecutive stops. */
  travelMinutesPerStop: number;
  /** Ordered list of stop ids this route serves. */
  stopIds: string[];
}

export const stops: Stop[] = [
  { id: 'central', name: 'Central Station', lat: 40.7128, lon: -74.006 },
  { id: 'market', name: 'Market Square', lat: 40.7185, lon: -74.0009 },
  { id: 'harbor', name: 'Harbor Front', lat: 40.7033, lon: -74.017 },
  { id: 'university', name: 'University Campus', lat: 40.7295, lon: -73.9965 },
  { id: 'airport', name: 'Airport Terminal', lat: 40.6413, lon: -73.7781 },
  { id: 'stadium', name: 'City Stadium', lat: 40.7505, lon: -73.9934 },
  { id: 'museum', name: 'Museum Mile', lat: 40.7794, lon: -73.9632 },
];

export const routes: Route[] = [
  {
    id: 'red',
    name: 'Red Line — Downtown Loop',
    color: '#e11d48',
    headwayMinutes: 10,
    travelMinutesPerStop: 4,
    stopIds: ['central', 'market', 'harbor', 'university'],
  },
  {
    id: 'blue',
    name: 'Blue Line — Airport Express',
    color: '#2563eb',
    headwayMinutes: 20,
    travelMinutesPerStop: 7,
    stopIds: ['central', 'harbor', 'airport'],
  },
  {
    id: 'green',
    name: 'Green Line — Uptown Culture',
    color: '#16a34a',
    headwayMinutes: 15,
    travelMinutesPerStop: 5,
    stopIds: ['central', 'stadium', 'museum', 'university'],
  },
];

export function getStop(id: string): Stop | undefined {
  return stops.find((s) => s.id === id);
}

export function getRoute(id: string): Route | undefined {
  return routes.find((r) => r.id === id);
}
