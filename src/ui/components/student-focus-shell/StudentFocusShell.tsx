import type { ReactNode } from 'react'
import { BrandMark } from '@/ui/components/brand/BrandMark'

/** Live class layout: only the brand, the screen name and who is signed in. No navigation away while a session is going on. */
export function StudentFocusShell({ title, user, klass, center, children }: { title: string; user: string; klass?: string; center?: ReactNode; children: ReactNode }) {
  return <div className="flex min-h-dvh flex-col bg-canvas">
    <a className="fixed top-2 left-2 z-3 -translate-y-[200%] bg-surface px-4 py-3 focus:translate-y-0" href="#student-focus">Lewati ke konten</a>
    {/* On a phone the bar can reach two rows; it scrolls away so the keyboard leaves room for the answer. Small laptops get a slimmer bar. */}
    <header className="sticky top-0 z-2 flex min-h-16 flex-wrap items-center gap-x-6 gap-y-2 border-0 border-b border-solid border-role-border bg-surface px-8 py-2 max-md:static max-md:gap-x-3 max-md:gap-y-1 max-md:px-4 [@media(min-width:768px)_and_(max-width:1599px),(min-width:768px)_and_(max-height:899px)]:min-h-14 [@media(min-width:768px)_and_(max-width:1599px),(min-width:768px)_and_(max-height:899px)]:py-1.5">
      <span className="flex shrink-0 items-center gap-2 text-[17px] font-extrabold tracking-[-.01em]"><BrandMark />NALAR</span>
      <span className="min-w-0 flex-1 text-sm font-semibold text-text-muted">{title}</span>
      {center}
      <span className="flex shrink-0 items-center gap-2 text-[13px] font-semibold"><span className="grid size-8 place-items-center rounded-full bg-warning-bg text-xs font-extrabold text-warning-text" aria-hidden="true">{user.split(' ').map((part) => part[0]).join('')}</span>{user.split(' ')[0]}{klass && ` · ${klass}`}</span>
    </header>
    <main id="student-focus" className="min-w-0 flex-1" tabIndex={-1}>{children}</main>
  </div>
}
