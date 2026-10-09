export function BrandMark({ size = 26, light = false }: { size?: number; light?: boolean }) {
  return <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
    <path d="M7 27V15.5a9 9 0 0 1 18 0V27" fill="none" stroke={light ? '#fff' : 'var(--color-primary)'} strokeWidth="5.2" strokeLinecap="round" />
    <circle cx="16" cy="21" r="3.4" fill="var(--color-accent)" />
  </svg>
}
