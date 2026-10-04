import { useState } from 'react'
import { Link } from 'react-router'
import type { AttentionItem, AttentionPage } from '@/domain/model/Teacher'
import type { ApiError } from '@/domain/model/ApiError'
import { Icon } from '@/ui/components/icon/Icon'
import { NalaAvatar, NalaIcon, type NalaIconName } from '@/ui/components/nala/NalaIcon'
import type { NalaMood } from '@/ui/components/nala/Nala'
import { NalaEmpty, NalaNote } from '@/ui/components/nala/NalaState'
import { Select } from '@/ui/components/select/Select'
import { formatDayTime } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import styles from '@/ui/pages/teacher/TeacherAttentionQueue.module.css'
import { Loading } from '@/ui/components/loading/Loading'

type Kind = AttentionItem['kind']
// Urgency order, the same as the home dashboard: student support first, then verification, material review and release.
const groups: readonly { kind: Kind; title: string; tab: string; hint: string; icon: NalaIconName; action: string }[] = [
  { kind: 'safety', title: 'Pendampingan siswa', tab: 'Keselamatan', hint: 'Sesi dijeda untuk keselamatan. Temui siswa lebih dulu.', icon: 'care', action: 'Dampingi siswa' },
  { kind: 'flag', title: 'Verifikasi sesi', tab: 'Perlu verifikasi', hint: 'Petunjuk untuk ditinjau, bukan tuduhan. Skor tidak berubah.', icon: 'verify', action: 'Tinjau sesi' },
  { kind: 'kb_review', title: 'Tinjauan materi', tab: 'Materi', hint: 'Konsep dan miskonsepsi menunggu persetujuan Anda.', icon: 'book', action: 'Tinjau materi' },
  { kind: 'release_ready', title: 'Rilis ke orang tua', tab: 'Siap dirilis', hint: 'Ringkasan siap Anda tinjau sebelum dirilis.', icon: 'send', action: 'Pratinjau rilis' },
]
const flagWord: Readonly<Record<string, string>> = { large_paste: 'Tempelan teks panjang', tab_switching: 'Sering berpindah tab', inconsistency_gap: 'Jawaban tidak konsisten', style_shift: 'Gaya tulisan berubah', cross_student_similarity: 'Mirip jawaban siswa lain', disconnect_pattern: 'Koneksi sering terputus' }
const number = new Intl.NumberFormat('id-ID')

// Each item opens the page where the teacher acts on it. `student` is set when the item is about a person.
function describe(item: AttentionItem, base: string): { to: string; who: string; summary: string; student: boolean; at: string } {
  if (item.kind === 'safety') return { to: `${base}/publications/${item.publication_id}/sessions/${item.session_id}`, who: item.student_name, summary: 'Sesi dijeda. Lanjutkan atau akhiri setelah bertemu siswa.', student: true, at: item.paused_at ?? item.created_at }
  if (item.kind === 'flag') return { to: `${base}/publications/${item.publication_id}/sessions/${item.session_id}`, who: item.student_name, summary: flagWord[item.flag_type] ?? item.flag_type, student: true, at: item.created_at }
  if (item.kind === 'kb_review') return { to: `${base}/knowledge-base/${item.knowledge_base_id}`, who: item.topic_title, summary: `${number.format(item.pending_concepts)} konsep dan ${number.format(item.pending_misconceptions)} miskonsepsi menunggu tinjauan.`, student: false, at: item.created_at }
  return { to: `${base}/publications/${item.publication_id}/release`, who: `${item.mission_title} · ${item.class_name}`, summary: `${number.format(item.eligible_count)} ringkasan siap dirilis.`, student: false, at: item.created_at }
}

// Null while the queue itself shows Nala (cleared, no match, unavailable): one Nala per view.
function companion(data: AttentionPage | null, failed: boolean): [NalaMood, string] | null {
  if (!data) return failed ? null : ['think', 'Sebentar, daftar perhatian sedang dimuat.']
  if (data.counts.safety > 0) return ['calm', 'Dahulukan pendampingan siswa, ya.']
  return ['ask', `${data.counts.total} catatan menunggu tinjauan Anda.`]
}

// The queue is read once by TeacherRoutes and shared with the sidebar badge.
export function TeacherAttentionPage({ data, error, online, refresh, base }: { data: AttentionPage | null; error: ApiError | null; online: boolean; refresh: () => void; base: string }) {
  const [kind, setKind] = useState('all'), [query, setQuery] = useState(''), [sort, setSort] = useState('original')
  const visible = data?.items.filter(item => (kind === 'all' || item.kind === kind)
    && `${describe(item, base).who} ${describe(item, base).summary}`.toLocaleLowerCase('id-ID').includes(query.trim().toLocaleLowerCase('id-ID'))) ?? []
  if (sort !== 'original') visible.sort((a, b) => (Date.parse(describe(a, base).at) - Date.parse(describe(b, base).at)) * (sort === 'oldest' ? 1 : -1))
  const filtered = kind !== 'all' || Boolean(query.trim())
  function reset() { setKind('all'); setQuery('') }
  const note = visible.length > 0 || !data ? companion(data, Boolean(error)) : null
  return <div className={styles.content}>
    <div className={styles.header}><div><h1>Perlu perhatian</h1><p>Tinjau catatan, pahami konteksnya, lalu tentukan tindak lanjut.</p></div>{note && <NalaNote mood={note[0]} text={note[1]} />}</div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <div className={styles.panel}><Loading label="Memuat daftar…" /></div>}
    {!data && error && <div className={styles.panel}><NalaEmpty mood="oops" title="Daftar perhatian belum dapat ditampilkan">Coba muat ulang melalui pilihan di atas.</NalaEmpty></div>}
    {data && <section className={styles.panel} aria-label="Daftar catatan">
      <div className={styles.tabs} role="group" aria-label="Jenis catatan">
        <button type="button" aria-pressed={kind === 'all'} onClick={() => setKind('all')}>Semua<span>{number.format(data.counts.total)}</span></button>
        {groups.map(group => <button key={group.kind} type="button" aria-pressed={kind === group.kind} disabled={data.counts[group.kind] === 0 && kind !== group.kind} onClick={() => setKind(kind === group.kind ? 'all' : group.kind)}>{group.tab}<span data-urgent={group.kind === 'safety' && data.counts.safety > 0}>{number.format(data.counts[group.kind])}</span></button>)}
      </div>
      <div className={styles.toolbar}>
        <label className={styles.search}><Icon name="search" size={18} /><input type="search" aria-label="Cari catatan" placeholder="Cari siswa, topik, atau misi…" value={query} onChange={event => setQuery(event.target.value)} /></label>
        <Select compact label="Urutkan catatan" value={sort} onChange={setSort} options={[{ value: 'original', label: 'Urutan awal' }, { value: 'newest', label: 'Terbaru dahulu' }, { value: 'oldest', label: 'Terlama dahulu' }]} />
        {filtered && <button className={styles.reset} type="button" onClick={reset}>Hapus filter</button>}
      </div>
      <p className={styles.resultCount} role="status">Menampilkan {number.format(visible.length)} dari {number.format(data.items.length)} catatan yang dimuat</p>
      {visible.length === 0
        ? (filtered ? <NalaEmpty mood="search" title="Tidak ada catatan yang cocok" action={<button className={styles.emptyAction} type="button" onClick={reset}>Tampilkan semua catatan</button>}>Coba kata kunci lain atau tampilkan semua jenis catatan.</NalaEmpty>
          : <NalaEmpty mood="proud" title="Tidak ada yang perlu perhatian di sini.">Catatan baru akan muncul saat ada hal yang perlu Anda tinjau.</NalaEmpty>)
        : groups.map(group => {
          const items = visible.filter(item => item.kind === group.kind)
          if (items.length === 0) return null
          const heading = `attention-${group.kind}`
          return <section key={group.kind} className={styles.group} data-kind={group.kind} aria-labelledby={heading}>
            <div className={styles.groupHead}><h2 id={heading}>{group.title}</h2><span className={styles.groupCount}>{number.format(items.length)}</span><p>{group.hint}</p></div>
            <ul className={styles.list}>{items.map(item => {
              const { to, who, summary, student, at } = describe(item, base)
              return <li key={`${item.kind}-${item.item_id}`}><Link className={styles.row} to={to}>
                <span className={styles.lead} data-person={student} aria-hidden="true">{student ? <NalaAvatar seed={who} size={40} /> : <NalaIcon name={group.icon} size={44} />}</span>
                <span className={styles.body}><strong className={styles.who}>{who}</strong><span className={styles.summary}>{summary}</span><time className={styles.when} dateTime={at}>{item.kind === 'safety' ? 'Dijeda ' : ''}{formatDayTime(at)}</time></span>
                <span className={styles.action}>{group.action}<Icon name="chevronRight" size={16} /></span>
              </Link></li>
            })}</ul>
          </section>
        })}
    </section>}
  </div>
}
