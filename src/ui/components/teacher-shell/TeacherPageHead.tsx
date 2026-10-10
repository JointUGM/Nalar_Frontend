import { useContext } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { PageHeadSlot } from './pageHeadSlot'

// As in "NALAR Guru.dc.html", a page's title sits in the shell's top bar beside search; outside the shell it stays in place.
export function TeacherPageHead({ crumb, title, tag, subtitle }: { crumb?: ReactNode; title: ReactNode; tag?: ReactNode; subtitle?: ReactNode }) {
  const slot = useContext(PageHeadSlot)
  const head = <div className="flex min-w-0 flex-col [&_a]:no-underline">
    {crumb && <div className="flex items-center gap-1.5 text-[13px] font-semibold text-text-muted [&_a]:text-text-muted [&_a:hover]:text-ink">{crumb}</div>}
    <div className="flex min-w-0 flex-wrap items-center gap-2.5"><h1 className="m-0 text-[24px] leading-[1.2] font-extrabold tracking-[-.02em] wrap-anywhere [&_a]:text-inherit [&_a:hover]:text-primary">{title}</h1>{tag}</div>
    {subtitle && <p className="m-0 text-[14px] leading-5 text-text-secondary">{subtitle}</p>}
  </div>
  return slot ? createPortal(head, slot) : head
}
