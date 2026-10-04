import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import type { KbSummary } from '@/domain/model/KnowledgeBase'
import type { KnowledgeBaseService } from '@/domain/services/KnowledgeBaseService'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Icon } from '@/ui/components/icon/Icon'
import { NalaIcon } from '@/ui/components/nala/NalaIcon'
import type { NalaMood } from '@/ui/components/nala/Nala'
import { NalaEmpty, NalaNote } from '@/ui/components/nala/NalaState'
import { Select } from '@/ui/components/select/Select'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/teacher/TeacherKbLibrary.module.css'

const state = (topic: KbSummary) => topic.pending_count > 0 ? 'review' : topic.approved_concept_count > 0 ? 'approved' : 'empty'
const filters = [['all', 'Semua topik'], ['review', 'Perlu tinjauan'], ['approved', 'Siap dipakai'], ['empty', 'Belum ada konsep']] as const
const titleOrder = new Intl.Collator('id-ID', { numeric: true, sensitivity: 'base' })
const number = new Intl.NumberFormat('id-ID')

// Null while the library itself shows Nala (empty, no match, unavailable): one Nala per view.
function companion(data: readonly KbSummary[] | null, failed: boolean): [NalaMood, string] | null {
  if (!data) return failed ? null : ['think', 'Sebentar, materi ajar sedang dimuat.']
  const waiting = data.filter(topic => topic.can_edit && topic.pending_count > 0).length
  if (waiting > 0) return ['read', `${number.format(waiting)} topik menunggu tinjauan konsep Anda.`]
  if (data.some(topic => topic.approved_concept_count > 0)) return ['proud', 'Konsep yang disetujui siap dipakai untuk misi.']
  return ['think', 'Susun bab materi agar konsepnya bisa ditinjau.']
}

export function TeacherKbListPage({ kb, base, schoolId }: { kb: KnowledgeBaseService; base: string; schoolId: string }) {
  const read = useCallback((signal: AbortSignal) => kb.list(schoolId, signal), [kb, schoolId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const [query, setQuery] = useState(''), [filter, setFilter] = useState('all')
  const [ownership, setOwnership] = useState('all'), [sort, setSort] = useState('original')
  const visible = (data ?? []).filter(topic => (filter === 'all' || state(topic) === filter)
    && (ownership === 'all' || topic.can_edit === (ownership === 'mine'))
    && topic.topic_title.toLocaleLowerCase('id-ID').includes(query.trim().toLocaleLowerCase('id-ID')))
  if (sort !== 'original') visible.sort((a, b) => titleOrder.compare(a.topic_title, b.topic_title) * (sort === 'title-desc' ? -1 : 1))
  const filtered = Boolean(query.trim()) || filter !== 'all' || ownership !== 'all'
  function reset() { setQuery(''); setFilter('all'); setOwnership('all') }
  const note = visible.length > 0 || !data ? companion(data, Boolean(error)) : null

  return <div className={styles.content}>
    <div className={styles.header}>
      <div><h1>Basis pengetahuan</h1><p>Temukan materi ajar, tinjau konsep, lalu gunakan yang sudah disetujui untuk misi.</p></div>
      {note && <NalaNote mood={note[0]} text={note[1]} />}
      <ButtonLink className={styles.upload} to={`${base}/knowledge-base/upload`}><Icon name="upload" size={16} />Unggah materi</ButtonLink>
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    <section className={styles.library} aria-labelledby="topic-library-title">
      <div className={styles.libraryHead}><h2 id="topic-library-title">Pustaka materi ajar</h2>{data && <span>{number.format(data.length)} topik dimuat</span>}</div>
      {!data && !error && <p className={styles.loading} role="status">Memuat basis pengetahuan…</p>}
      {!data && error && <NalaEmpty mood="oops" title="Basis pengetahuan belum dapat ditampilkan">Coba muat ulang melalui pilihan di atas.</NalaEmpty>}
      {data && data.length === 0 && <NalaEmpty mood="ask" title="Belum ada basis pengetahuan" action={<ButtonLink tone="secondary" className={styles.emptyAction} to={`${base}/knowledge-base/upload`}><Icon name="upload" size={16} />Unggah materi pertama</ButtonLink>}>
        Unggah materi ajar (PDF) untuk memulai topik pertama.
      </NalaEmpty>}
      {data && data.length > 0 && <>
        <div className={styles.filters} role="group" aria-label="Status topik">{filters.map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}<span>{number.format(data.filter(topic => value === 'all' || state(topic) === value).length)}</span></button>)}</div>
        <div className={styles.toolbar}>
          <label className={styles.search}><Icon name="search" size={18} /><input type="search" aria-label="Cari topik" placeholder="Cari topik materi ajar…" value={query} onChange={event => setQuery(event.target.value)} /></label>
          <Select compact label="Filter pemilik topik" value={ownership} onChange={setOwnership} options={[{ value: 'all', label: 'Semua guru' }, { value: 'mine', label: 'Milik Anda' }, { value: 'colleagues', label: 'Rekan guru' }]} />
          <Select compact label="Urutkan topik" value={sort} onChange={setSort} options={[{ value: 'original', label: 'Urutan awal' }, { value: 'title-asc', label: 'Judul A–Z' }, { value: 'title-desc', label: 'Judul Z–A' }]} />
          {filtered && <button className={styles.reset} type="button" onClick={reset}>Hapus filter</button>}
        </div>
        <p className={styles.resultCount} role="status">Menampilkan {number.format(visible.length)} dari {number.format(data.length)} topik yang dimuat</p>
        {visible.length === 0 ? <NalaEmpty mood="search" title="Tidak ada topik yang cocok" action={<button className={styles.emptyAction} type="button" onClick={reset}>Tampilkan semua topik</button>}>Coba kata kunci lain atau hapus filter.</NalaEmpty> : <>
          <div className={styles.columns} aria-hidden="true"><span>Topik dan materi</span><span>Konsep</span><span>Tindak lanjut</span></div>
          <ul className={styles.list} aria-label="Topik basis pengetahuan">{visible.map(topic => {
            const tone = state(topic), path = `${base}/knowledge-base/${topic.id}`
            const label = filters.find(([value]) => value === tone)![1]
            return <li key={topic.id} className={styles.row}>
              <div className={styles.identity}><span className={styles.fileIcon}><NalaIcon name="book" size={44} /></span><div>
                <h3><Link to={path}>{topic.topic_title}</Link></h3>
                <p>{topic.can_edit ? 'Milik Anda' : `Dari ${topic.owner_name ?? 'rekan guru'}`}</p>
                <p>{number.format(topic.material_count)} materi · {number.format(topic.built_section_count)} bab disusun</p>
              </div></div>
              <div className={styles.review}><span className={styles.status} data-status={tone}>{label}</span>
                <dl><div><dt>Konsep disetujui</dt><dd>{number.format(topic.approved_concept_count)}</dd></div><div><dt>Menunggu tinjauan</dt><dd>{number.format(topic.pending_count)}</dd></div></dl>
              </div>
              <Link className={styles.action} to={path}>{topic.can_edit && topic.pending_count > 0 ? 'Tinjau konsep' : 'Buka topik'}<Icon name="chevronRight" size={16} /></Link>
            </li>
          })}</ul>
        </>}
        <p className={styles.note}><NalaIcon name="info" />Hanya konsep dan miskonsepsi yang Anda setujui dipakai untuk misi.</p>
      </>}
    </section>
  </div>
}
