import { Button } from '@/ui/components/button/Button'

export function LibraryStatusFilter({ value, onChange }: { value: 'active' | 'archived'; onChange: (value: 'active' | 'archived') => void }) {
  return <div role="group" aria-label="Status pustaka" className="flex w-fit max-w-full gap-1 rounded-xl bg-surface p-1">
    {(['active', 'archived'] as const).map((status) => <Button key={status} tone="ghost" aria-pressed={value === status} onClick={() => onChange(status)} className="min-h-10 rounded-lg px-4 py-2 text-[14px] aria-pressed:bg-info-bg aria-pressed:text-primary max-md:min-h-11">{status === 'active' ? 'Aktif' : 'Diarsipkan'}</Button>)}
  </div>
}
