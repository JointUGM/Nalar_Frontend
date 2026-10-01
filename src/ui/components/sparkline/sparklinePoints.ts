/** Points of a 64x24 trend line scaled to the series' own range; the last point is marked by the caller. */
export function sparklinePoints(trend: readonly number[], width = 64, height = 24): { points: string; lastY: number } {
  const min = Math.min(...trend), span = Math.max(...trend) - min || 1
  const ys = trend.map((value) => height - 2 - ((value - min) / span) * (height - 4))
  return { points: ys.map((y, index) => `${(index * width / Math.max(trend.length - 1, 1)).toFixed(1)},${y.toFixed(1)}`).join(' '), lastY: ys[ys.length - 1] }
}
