import { useLayoutEffect, useRef, useState } from 'react'
import type { KbConcept } from '@/domain/model/KnowledgeBase'
import { Icon } from '@/ui/components/icon/Icon'

interface Line { key: string; x1: number; y1: number; x2: number; y2: number }
const node = 'relative inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border border-role-border bg-surface px-3.5 py-1.5 text-[14px] font-bold text-ink transition-[background-color,color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-white data-[status=approved]:not-aria-pressed:border-transparent data-[status=approved]:not-aria-pressed:bg-success-bg data-[status=rejected]:not-aria-pressed:border-dashed data-[status=rejected]:not-aria-pressed:text-text-muted'

// Prerequisites run top to bottom: a concept sits one row below the deepest concept it builds on (the passes also stop a cycle).
function layers(concepts: readonly KbConcept[], links: readonly { concept_id: string; prerequisite_concept_id: string }[]) {
  const depth = new Map(concepts.map((concept) => [concept.id, 0]))
  for (let pass = 0; pass < concepts.length; pass++) for (const link of links) {
    const from = depth.get(link.prerequisite_concept_id), to = depth.get(link.concept_id)
    if (from !== undefined && to !== undefined && to <= from && from < concepts.length) depth.set(link.concept_id, from + 1)
  }
  const rows: KbConcept[][] = []
  for (const concept of concepts) (rows[depth.get(concept.id) ?? 0] ??= []).push(concept)
  return rows.filter(Boolean)
}

export function KbConceptMap({ concepts, prerequisites, selectedId, count, onSelect }: { concepts: readonly KbConcept[]; prerequisites: readonly { concept_id: string; prerequisite_concept_id: string }[]; selectedId: string; count: (conceptId: string) => number; onSelect: (id: string) => void }) {
  const box = useRef<HTMLDivElement>(null), nodes = useRef(new Map<string, HTMLElement>())
  const [lines, setLines] = useState<Line[]>([])
  const rows = layers(concepts, prerequisites)
  useLayoutEffect(() => {
    const measure = () => {
      const origin = box.current?.getBoundingClientRect()
      if (!origin) return
      setLines(prerequisites.flatMap((link) => {
        const from = nodes.current.get(link.prerequisite_concept_id)?.getBoundingClientRect(), to = nodes.current.get(link.concept_id)?.getBoundingClientRect()
        if (!from || !to) return []
        return [{ key: `${link.prerequisite_concept_id}>${link.concept_id}`, x1: from.left + from.width / 2 - origin.left, y1: from.bottom - origin.top, x2: to.left + to.width / 2 - origin.left, y2: to.top - origin.top - 2 }]
      }))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [concepts, prerequisites])

  return <div ref={box} className="relative grid gap-14 overflow-x-auto rounded-xl bg-paper px-4 py-8 [background-image:radial-gradient(var(--color-role-border)_1px,transparent_1px)] [background-size:18px_18px]">
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full text-primary">
      <defs><marker id="kb-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor" /></marker></defs>
      {lines.map((line) => <line key={line.key} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="currentColor" strokeWidth="1.5" markerEnd="url(#kb-arrow)" />)}
    </svg>
    {rows.map((row, index) => <div key={index} className="relative flex flex-wrap justify-center gap-x-8 gap-y-6">{row.map((concept) => <button key={concept.id} ref={(element) => { if (element) nodes.current.set(concept.id, element); else nodes.current.delete(concept.id) }} type="button" className={node} data-status={concept.review_status} aria-pressed={concept.id === selectedId} onClick={() => onSelect(concept.id)}>
      {concept.review_status === 'approved' && <Icon name="check" size={14} />}{concept.name}
      {count(concept.id) > 0 && <span className="grid size-5 place-items-center rounded-pill bg-accent text-[11px] font-extrabold text-ink tabular-nums" title="Jumlah miskonsepsi">{count(concept.id)}</span>}
    </button>)}</div>)}
  </div>
}
