import type { Route } from './data.js';

export interface Arrival {
  routeId: string;
  routeName: string;
  routeColor: string;
  stopId: string;
  /** ISO timestamp of the predicted arrival. */
  arrivalTime: string;
  /** Whole minutes until arrival (0 means "due"). */
  minutesAway: number;
}

/**
 * Deterministic timetable model: bus number 0 for a route departs the first
 * stop at the Unix epoch, and buses leave every `headwayMinutes`. A bus reaches
 * stop index `i` after `i * travelMinutesPerStop` minutes. This makes arrival
 * predictions a pure function of the current time, which keeps the API testable
 * while still counting down in real time for a live UI.
 */
export function nextArrivals(
  route: Route,
  stopId: string,
  now: Date,
  count = 3,
): Arrival[] {
  const stopIndex = route.stopIds.indexOf(stopId);
  if (stopIndex === -1) return [];

  const headwayMs = route.headwayMinutes * 60_000;
  const stopOffsetMs = stopIndex * route.travelMinutesPerStop * 60_000;
  const nowMs = now.getTime();

  // First bus to reach this stop at-or-after `now`.
  const elapsedSinceFirst = nowMs - stopOffsetMs;
  const firstIndex = Math.max(0, Math.ceil(elapsedSinceFirst / headwayMs));

  const arrivals: Arrival[] = [];
  for (let i = 0; i < count; i++) {
    const arrivalMs = stopOffsetMs + (firstIndex + i) * headwayMs;
    arrivals.push({
      routeId: route.id,
      routeName: route.name,
      routeColor: route.color,
      stopId,
      arrivalTime: new Date(arrivalMs).toISOString(),
      minutesAway: Math.max(0, Math.floor((arrivalMs - nowMs) / 60_000)),
    });
  }
  return arrivals;
}
