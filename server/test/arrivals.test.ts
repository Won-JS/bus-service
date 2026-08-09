import { describe, expect, it } from 'vitest';
import { nextArrivals } from '../src/arrivals.js';
import { getRoute } from '../src/data.js';

const red = getRoute('red')!;

describe('nextArrivals', () => {
  it('returns the requested number of upcoming arrivals', () => {
    const arrivals = nextArrivals(red, 'central', new Date('2026-01-01T09:03:00Z'), 4);
    expect(arrivals).toHaveLength(4);
  });

  it('spaces arrivals by the route headway', () => {
    const arrivals = nextArrivals(red, 'central', new Date('2026-01-01T09:03:00Z'), 3);
    const deltas = arrivals
      .slice(1)
      .map((a, i) => a.minutesAway - arrivals[i].minutesAway);
    expect(deltas).toEqual([red.headwayMinutes, red.headwayMinutes]);
  });

  it('never predicts an arrival in the past', () => {
    const arrivals = nextArrivals(red, 'market', new Date('2026-06-15T18:47:23Z'));
    for (const arrival of arrivals) {
      expect(arrival.minutesAway).toBeGreaterThanOrEqual(0);
    }
  });

  it('accounts for travel time to later stops', () => {
    const now = new Date('2026-01-01T09:00:00Z');
    const atFirst = nextArrivals(red, 'central', now, 1)[0];
    const atThird = nextArrivals(red, 'harbor', now, 1)[0];
    // 'harbor' is stop index 2, so its first bus is offset by 2 * travel time.
    expect(atThird.minutesAway).toBeGreaterThan(atFirst.minutesAway);
  });

  it('returns nothing for a stop the route does not serve', () => {
    expect(nextArrivals(red, 'airport', new Date())).toEqual([]);
  });
});
