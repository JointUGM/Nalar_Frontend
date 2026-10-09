import { useState } from 'react'
import { Link } from 'react-router'
import type { AttentionItem, AttentionPage } from '@/domain/model/Teacher'
import type { ApiError } from '@/domain/model/ApiError'
import { cn } from '@/ui/cn'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Icon } from '@/ui/components/icon/Icon'
import { Loading } from '@/ui/components/loading/Loading'
import type { NalaMood } from '@/ui/components/nala/Nala'
import { NalaAvatar, NalaIcon } from '@/ui/components/nala/NalaIcon'
import { NalaEmpty, NalaNote } from '@/ui/components/nala/NalaState'
import { Select } from '@/ui/components/select/Select'
import { formatDayTime } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { attentionKind, attentionKinds, attentionRank, describeAttention, flagWord, isKnownAttention, severityWord, waitedFor } from '@/ui/pages/teacher/app/attentionText'
import type { AttentionView } from '@/ui/pages/teacher/app/attentionText'
import styles from '@/ui/pages/teacher/TeacherAttention.styles'

type Kind = AttentionItem['kind']
interface Entry { key: string; item: AttentionItem; view: AttentionView }
const number = new Intl.NumberFormat('id-ID')

// Null while the queue itself shows Nala (cleared, no match, unavailable): one Nala per view.
function companion(data: AttentionPage | null, failed: boolean): [NalaMood, string] | null {
  if (!data) return failed ? null : ['think', 'Sebentar, daftar perhatian sedang dimuat.']
  if (data.counts.safety > 0) return ['calm', 'Dahulukan pendampingan siswa, ya.']
  return ['ask', `${data.counts.total} catatan menunggu tinjauan Anda.`]
}

// The few facts a teacher weighs before opening the item, read straight from the queue.
function facts(item: AttentionItem, at: string): [string, string][] {
  switch (item.kind) {
    case 'safety': return [['Dijeda', formatDayTime(at)], ['Menunggu', waitedFor(at)]]
    case 'flag': return [['Jenis', flagWord[item.flag_type] ?? item.flag_type], ['Tingkat', severityWord[item.severity] ?? item.severity], ['Dicatat', formatDayTime(at)]]
    case 'kb_review': return [['Konsep', `${number.format(item.pending_concepts)} menunggu`], ['Miskonsepsi', `${number.format(item.pending_misconceptions)} menunggu`], ['Masuk', formatDayTime(at)]]
    case 'release_ready': return [['Ringkasan', `${number.format(item.eligible_count)} siap`], ['Kelas', item.class_name], ['Siap sejak', formatDayTime(at)]]
  }
}

function Lead({ entry, size }: { entry: Entry; size: number }) {
  return entry.view.student ? <NalaAvatar seed={entry.view.who} size={size} /> : <NalaIcon name={attentionKind[entry.item.kind].nala} size={size + 2} />
}

function RowBody({ entry }: { entry: Entry }) {
  const kind = attentionKind[entry.item.kind]
  return <>
    <span className={styles.rowTop}><span className={styles.sev} data-kind={entry.item.kind}><Icon name={kind.icon} size={11} />{kind.label}</span><time className={styles.when} dateTime={entry.view.at}>{formatDayTime(entry.view.at)}</time></span>
    <span className={styles.rowMain}><span className={styles.lead} aria-hidden="true"><Lead entry={entry} size={32} /></span><span className="min-w-0"><strong className={styles.who}>{entry.view.who}</strong><span className={styles.summary}>{entry.view.summary}</span></span></span>
  </>
}

function Detail({ entry }: { entry: Entry }) {
  const { item, view } = entry
  const kind = attentionKind[item.kind]
  const rows = facts(item, view.at)
  return <aside id="attention-detail" className={styles.detail} aria-labelledby="attention-detail-title">
    <span className={styles.sev} data-kind={item.kind}><Icon name={kind.icon} size={11} />{kind.label}</span>
    <div className={styles.detailWho}><span aria-hidden="true"><Lead entry={entry} size={40} /></span><div className="min-w-0"><h2 id="attention-detail-title">{view.who}</h2><p>{view.summary}</p></div></div>
    <dl className={cn(styles.facts, rows.length === 2 ? 'grid-cols-2' : 'grid-cols-3')}>{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <h3>Catatan</h3>
    <p>{kind.note}</p>
    <div className={styles.next} data-kind={item.kind}><strong><NalaIcon name={kind.nala} size={22} />Langkah berikutnya</strong><p>{kind.next}</p></div>
    <ButtonLink to={view.to} className={styles.go} data-kind={item.kind}>{kind.action}<Icon name="chevronRight" size={16} /></ButtonLink>
  </aside>
}

// The queue is read once by TeacherRoutes and shared with the sidebar badge.
export function TeacherAttentionPage({ data, error, online, refresh, base }: { data: AttentionPage | null; error: ApiError | null; online: boolean; refresh: () => void; base: string }) {
  const [kind, setKind] = useState<Kind | 'all'>('all'), [query, setQuery] = useState(''), [sort, setSort] = useState('original'), [picked, setPicked] = useState<string | null>(null)
  const needle = query.trim().toLocaleLowerCase('id-ID')
  const entries: Entry[] = (data?.items ?? []).filter(isKnownAttention).map((item) => ({ key: `${item.kind}-${item.item_id}`, item, view: describeAttention(item, base) }))
  const visible = entries.filter(({ item, view }) => (kind === 'all' || item.kind === kind) && `${view.who} ${view.summary}`.toLocaleLowerCase('id-ID').includes(needle))
    // Array.sort is stable, so "Urutan awal" keeps the server's order inside each kind.
    .sort((a, b) => sort === 'original' ? attentionRank(a.item) - attentionRank(b.item) : (Date.parse(a.view.at) - Date.parse(b.view.at)) * (sort === 'oldest' ? 1 : -1))
  const selected = visible.find((entry) => entry.key === picked) ?? visible[0]
  const filtered = kind !== 'all' || Boolean(needle)
  function reset() { setKind('all'); setQuery('') }
  const note = visible.length > 0 || !data ? companion(data, Boolean(error)) : null
  return <div className={styles.page}>
    <div className={styles.header}><div><h1>Perlu perhatian</h1><p>Keselamatan siswa, catatan verifikasi, materi, dan rilis yang menunggu keputusan Anda.</p></div>{note && <NalaNote mood={note[0]} text={note[1]} />}</div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {data && <div className={styles.strip}><div className={styles.stats} role="group" aria-label="Saring jenis catatan">
      {attentionKinds.map((entry) => {
        const count = data.counts[entry.kind]
        return <button key={entry.kind} type="button" className={styles.stat} data-urgent={entry.kind === 'safety' && count > 0} aria-pressed={kind === entry.kind} disabled={count === 0 && kind !== entry.kind} onClick={() => setKind(kind === entry.kind ? 'all' : entry.kind)}>
          <NalaIcon name={entry.nala} size={28} />
          <span className={styles.statLine}><strong>{number.format(count)}</strong>{entry.label}</span>
          <span className={styles.statHint}>{entry.hint}</span>
        </button>
      })}
    </div></div>}
    {!data && !error && <div className={styles.card}><div className={styles.panelState}><Loading label="Memuat daftar…" /></div></div>}
    {!data && error && <div className={styles.card}><NalaEmpty mood="oops" title="Daftar perhatian belum dapat ditampilkan">Coba muat ulang melalui pilihan di atas.</NalaEmpty></div>}
    {data && <section className={styles.card} aria-label="Daftar catatan">
      <div className={styles.toolbar}>
        <p className={styles.count} role="status">{filtered ? `Menampilkan ${number.format(visible.length)} dari ${number.format(entries.length)} catatan` : `Total ${number.format(entries.length)} catatan`}</p>
        <label className={styles.search}><Icon name="search" size={16} /><input type="search" aria-label="Cari catatan" placeholder="Cari siswa, topik, atau misi…" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <Select compact label="Urutkan catatan" value={sort} onChange={setSort} options={[{ value: 'original', label: 'Paling mendesak' }, { value: 'newest', label: 'Terbaru dahulu' }, { value: 'oldest', label: 'Terlama dahulu' }]} />
        {filtered && <button className={styles.reset} type="button" onClick={reset}>Hapus filter</button>}
      </div>
      {visible.length === 0
        ? (filtered ? <NalaEmpty mood="search" title="Tidak ada catatan yang cocok" action={<button className={styles.reset} type="button" onClick={reset}>Tampilkan semua catatan</button>}>Coba kata kunci lain atau tampilkan semua jenis catatan.</NalaEmpty>
          : <NalaEmpty mood="proud" title="Tidak ada yang perlu perhatian di sini.">Catatan baru akan muncul saat ada hal yang perlu Anda tinjau.</NalaEmpty>)
        : <div className={styles.split}>
          {/* From 1024px a row selects and the detail beside it carries the action; on smaller screens the row is the link. */}
          <ul className={styles.list}>{visible.map((entry) => <li key={entry.key}>
            <button type="button" className={cn(styles.row, 'max-lg:hidden')} aria-pressed={entry === selected} aria-controls="attention-detail" onClick={() => setPicked(entry.key)}><RowBody entry={entry} /></button>
            <Link to={entry.view.to} className={cn(styles.row, 'lg:hidden')} data-kind={entry.item.kind}><RowBody entry={entry} /><span className={styles.rowGo}>{attentionKind[entry.item.kind].action}<Icon name="chevronRight" size={14} /></span></Link>
          </li>)}</ul>
          {selected && <Detail entry={selected} />}
        </div>}
    </section>}
  </div>
}
