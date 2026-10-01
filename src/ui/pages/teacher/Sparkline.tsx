import { sparklinePoints } from './teacherHomeExamples'

export function Sparkline({ trend, label }: { trend: readonly number[]; label: string }) {
  const { points, lastY } = sparklinePoints(trend)
  return <svg role="img" aria-label={`${label}: ${trend.join(', ')}`} viewBox="0 0 64 24" width="64" height="24" style={{ overflow: 'visible', flexShrink: 0 }}>
    <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    <circle cx="64" cy={lastY} r="2.5" fill="currentColor" />
  </svg>
}
