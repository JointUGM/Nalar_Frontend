import styles from './TeacherKbReview.module.css'

interface MapNode { id: string; name: string; x: number; y: number; mis: readonly unknown[] }

// SVG user units equal the map's 560x380 box, so a node's x/y percent maps straight onto the line ends.
const width = 560
const height = 380

export function ConceptMap({ nodes, leadsTo, selectedId, onSelect }: { nodes: readonly MapNode[]; leadsTo: readonly (readonly [string, string])[]; selectedId: string; onSelect: (id: string) => void }) {
  const point = (id: string) => { const node = nodes.find((item) => item.id === id); return node ? { x: node.x * width / 100, y: node.y * height / 100 } : null }
  return <div className={styles.mapRegion} role="region" aria-label="Peta konsep (dapat digulir)" tabIndex={0}>
    <div className={styles.map}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
        <defs><marker id="kb-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10z" className={styles.arrow} /></marker></defs>
        {leadsTo.map(([from, to]) => {
          const a = point(from), b = point(to)
          return a && b && <path key={`${from}-${to}`} className={styles.edge} markerMid="url(#kb-arrow)" d={`M${a.x} ${a.y}L${(a.x + b.x) / 2} ${(a.y + b.y) / 2}L${b.x} ${b.y}`} />
        })}
      </svg>
      <ul>{nodes.map((node) => <li key={node.id} style={{ left: `${node.x}%`, top: `${node.y}%` }}>
        <button type="button" aria-pressed={node.id === selectedId} aria-label={node.mis.length ? `${node.name}, ${node.mis.length} miskonsepsi` : undefined} onClick={() => onSelect(node.id)}>{node.name}{node.mis.length > 0 && <span className={styles.count} aria-hidden="true">{node.mis.length}</span>}</button>
      </li>)}</ul>
    </div>
  </div>
}
