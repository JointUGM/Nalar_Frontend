import { useLayoutEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import type { KbConcept } from '@/domain/model/KnowledgeBase'
import { Icon } from '@/ui/components/icon/Icon'

interface Line { key: string; x1: number; y1: number; x2: number; y2: number }
const node = 'relative inline-flex min-h-10 cursor-grab touch-none select-none active:cursor-grabbing items-center gap-2 rounded-xl border border-role-border bg-surface px-3.5 py-1.5 text-[14px] font-bold text-ink transition-[background-color,color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-white data-[status=approved]:not-aria-pressed:border-transparent data-[status=approved]:not-aria-pressed:bg-success-bg data-[status=rejected]:not-aria-pressed:border-dashed data-[status=rejected]:not-aria-pressed:text-text-muted'
const zoomButton = 'grid h-7 min-w-7 cursor-pointer place-items-center rounded-md border-0 bg-transparent px-1.5 text-[14px] font-bold text-ink hover:not-disabled:bg-info-bg disabled:cursor-default disabled:opacity-40'

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
  const [zoom, setZoom] = useState(1)
  const zoomBy = (step: number) => setZoom((value) => Math.min(1.6, Math.max(0.5, Math.round((value + step) * 10) / 10)))
  const [lines, setLines] = useState<Line[]>([])
  // Nodes start in their rows; dragging only adds an offset, so the layout is never lost (Rapikan clears it).
  const [moved, setMoved] = useState<Record<string, { x: number; y: number }>>({})
  const drag = useRef<{ id: string; x: number; y: number; from: { x: number; y: number }; moved: boolean } | null>(null)
  const dragged = useRef(false)
  const down = (id: string, event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { id, x: event.clientX, y: event.clientY, from: moved[id] ?? { x: 0, y: 0 }, moved: false }
  }
  const move = (event: PointerEvent<HTMLButtonElement>) => {
    const current = drag.current
    if (!current) return
    const dx = (event.clientX - current.x) / zoom, dy = (event.clientY - current.y) / zoom
    if (!current.moved && Math.hypot(dx, dy) * zoom < 4) return
    current.moved = true
    setMoved((offsets) => ({ ...offsets, [current.id]: { x: current.from.x + dx, y: current.from.y + dy } }))
  }
  const up = () => {
    // The click that follows a drag must not select; it fires right after pointerup.
    dragged.current = drag.current?.moved ?? false
    drag.current = null
    setTimeout(() => { dragged.current = false })
  }
  const rows = layers(concepts, prerequisites)
  useLayoutEffect(() => {
    const measure = () => {
      const origin = box.current?.getBoundingClientRect()
      if (!origin) return
      const scrollX = box.current?.scrollLeft ?? 0, scrollY = box.current?.scrollTop ?? 0
      setLines(prerequisites.flatMap((link) => {
        const from = nodes.current.get(link.prerequisite_concept_id)?.getBoundingClientRect(), to = nodes.current.get(link.concept_id)?.getBoundingClientRect()
        if (!from || !to) return []
        return [{ key: `${link.prerequisite_concept_id}>${link.concept_id}`, x1: from.left + from.width / 2 - origin.left + scrollX, y1: from.bottom - origin.top + scrollY, x2: to.left + to.width / 2 - origin.left + scrollX, y2: to.top - origin.top + scrollY - 2 }]
      }))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [concepts, prerequisites, moved, zoom])

  return <div ref={box} className="relative flex flex-1 flex-col overflow-auto rounded-xl bg-paper px-4 [background-image:radial-gradient(var(--color-role-border)_1px,transparent_1px)] [background-size:18px_18px]">
    {Object.keys(moved).length > 0 && <button type="button" className="absolute top-2 right-2 z-20 cursor-pointer rounded-lg border-0 bg-surface px-2.5 py-1 text-[12px] font-bold text-primary hover:bg-info-bg" onClick={() => setMoved({})}>Rapikan</button>}
    <div className="absolute top-2 left-2 z-20 flex items-center gap-1 rounded-lg bg-surface p-0.5 text-[12px] font-bold text-ink" role="group" aria-label="Perbesar peta">
      <button type="button" className={zoomButton} aria-label="Perkecil" disabled={zoom <= 0.5} onClick={() => zoomBy(-0.1)}>−</button>
      <button type="button" className={zoomButton} aria-label="Ukuran asli" onClick={() => setZoom(1)}><span className="tabular-nums">{Math.round(zoom * 100)}%</span></button>
      <button type="button" className={zoomButton} aria-label="Perbesar" disabled={zoom >= 1.6} onClick={() => zoomBy(0.1)}>+</button>
    </div>
    <svg aria-hidden="true" className="pointer-events-none absolute top-0 left-0 size-full overflow-visible text-primary">
      <defs><marker id="kb-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor" /></marker></defs>
      {lines.map((line) => <line key={line.key} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="currentColor" strokeWidth="1.5" markerEnd="url(#kb-arrow)" />)}
    </svg>
    <div className="flex flex-1 origin-top-left flex-col justify-evenly gap-14 px-4 pt-12 pb-8" style={{ width: `${100 / zoom}%`, scale: zoom }}>
    {rows.map((row, index) => <div key={index} className="relative flex flex-wrap justify-center gap-x-8 gap-y-6">{row.map((concept) => <button key={concept.id} ref={(element) => { if (element) nodes.current.set(concept.id, element); else nodes.current.delete(concept.id) }} type="button" className={[node, moved[concept.id] ? 'z-10' : ''].join(' ')} style={moved[concept.id] ? { translate: `${moved[concept.id].x}px ${moved[concept.id].y}px` } : undefined} onPointerDown={(event) => down(concept.id, event)} onPointerMove={move} onPointerUp={up} onPointerCancel={up} data-status={concept.review_status} aria-pressed={concept.id === selectedId} onClick={() => { if (!dragged.current) onSelect(concept.id) }}>
      {concept.review_status === 'approved' && <Icon name="check" size={14} />}{concept.name}
      {count(concept.id) > 0 && <span className="grid size-5 place-items-center rounded-pill bg-accent text-[11px] font-extrabold text-ink tabular-nums" title="Jumlah miskonsepsi">{count(concept.id)}</span>}
    </button>)}</div>)}
    </div>
  </div>
}
