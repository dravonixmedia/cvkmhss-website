/**
 * Delay (ms) for the nth item in a staggered reveal group. Capped so long
 * lists don't leave later items waiting several seconds.
 */
export function staggerDelay(index: number, step = 80, max = 480): number {
  return Math.min(index * step, max);
}
