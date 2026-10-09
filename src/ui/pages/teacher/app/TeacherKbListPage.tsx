import { useCallback, useState } from 'react'
import { TeacherPageHead } from '@/ui/components/teacher-shell/TeacherPageHead'
import { Link } from 'react-router'
import type { KbSummary } from '@/domain/model/KnowledgeBase'
import type { KnowledgeBaseService } from '@/domain/services/KnowledgeBaseService'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Icon } from '@/ui/components/icon/Icon'
import { Loading } from '@/ui/components/loading/Loading'
import { NalaEmpty } from '@/ui/components/nala/NalaState'
import { Select } from '@/ui/components/select/Select'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/teacher/TeacherKbLibrary.styles'
import { ConfirmAction } from './ConfirmAction'
import { kbRefusal } from './kbText'

type TopicState = 'review' | 'approved' | 'empty'
const state = (topic: KbSummary): TopicState => topic.pending_count > 0 ? 'review' : topic.approved_concept_count > 0 ? 'approved' : 'empty'
const stateLabel: Record<TopicState, string> = { review: 'Perlu tinjauan', approved: 'Siap dipakai', empty: 'Belum ada konsep' }
// The strip is the filter; "Semua topik" keeps every cell meaningful and the grid free of holes.
const filters: readonly { value: 'all' | TopicState; label: string; hint: (topics: readonly KbSummary[]) => string }[] = [
  { value: 'all', label: 'Semua topik', hint: (topics) => `${number.format(topics.filter((topic) => topic.can_edit).length)} milik Anda` },
  { value: 'review', label: stateLabel.review, hint: () => 'konsep menunggu Anda' },
  { value: 'approved', label: stateLabel.approved, hint: () => 'bisa dipakai untuk misi' },
  { value: 'empty', label: stateLabel.empty, hint: () => 'bab belum disusun' },
]
const titleOrder = new Intl.Collator('id-ID', { numeric: true, sensitivity: 'base' })
const number = new Intl.NumberFormat('id-ID')

export function TeacherKbListPage({ kb, base, schoolId }: { kb: KnowledgeBaseService; base: string; schoolId: string }) {
  const read = useCallback((signal: AbortSignal) => kb.list(schoolId, signal), [kb, schoolId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const [query, setQuery] = useState(''), [filter, setFilter] = useState<'all' | TopicState>('all')
  const [ownership, setOwnership] = useState('all'), [sort, setSort] = useState('original')
  const visible = (data ?? []).filter(topic => (filter === 'all' || state(topic) === filter)
    && (ownership === 'all' || topic.can_edit === (ownership === 'mine'))
    && topic.topic_title.toLocaleLowerCase('id-ID').includes(query.trim().toLocaleLowerCase('id-ID')))
  if (sort !== 'original') visible.sort((a, b) => titleOrder.compare(a.topic_title, b.topic_title) * (sort === 'title-desc' ? -1 : 1))
  const filtered = Boolean(query.trim()) || filter !== 'all' || ownership !== 'all'
  function reset() { setQuery(''); setFilter('all'); setOwnership('all') }
  const waiting = data?.filter((topic) => topic.pending_count > 0).length ?? 0

  return <div className={styles.page}>
    <TeacherPageHead title="Basis pengetahuan" subtitle={data && data.length > 0 ? `${number.format(data.length)} topik${waiting > 0 ? `, ${number.format(waiting)} menunggu tinjauan` : ''}. Hanya konsep yang Anda setujui dipakai untuk misi.` : 'Unggah materi ajar, tinjau konsepnya, lalu gunakan yang disetujui untuk misi.'} />
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <section className={styles.panel}><div className={styles.state}><Loading label="Memuat basis pengetahuan…" /></div></section>}
    {!data && error && <section className={styles.panel}><NalaEmpty mood="oops" title="Basis pengetahuan belum dapat ditampilkan">Coba muat ulang melalui pilihan di atas.</NalaEmpty></section>}
    {data && data.length === 0 && <section className={styles.panel}><NalaEmpty mood="ask" title="Belum ada basis pengetahuan" action={<ButtonLink tone="secondary" className={styles.button} to={`${base}/knowledge-base/upload`}><Icon name="upload" size={16} />Unggah materi pertama</ButtonLink>}>
      Unggah materi ajar (PDF) untuk memulai topik pertama.
    </NalaEmpty></section>}
    {data && data.length > 0 && <div className={styles.layout}><div className={styles.main}>
      <div className={styles.strip}><div className={styles.stats} role="group" aria-label="Status topik">{filters.map((entry) => {
        const count = data.filter((topic) => entry.value === 'all' || state(topic) === entry.value).length
        return <button key={entry.value} type="button" className={styles.stat} aria-pressed={filter === entry.value} disabled={count === 0 && filter !== entry.value} onClick={() => setFilter(filter === entry.value ? 'all' : entry.value)}>

          <span className={styles.statLine}><strong>{number.format(count)}</strong>{entry.label}</span>
          <span className={styles.statHint}>{entry.hint(data)}</span>
        </button>
      })}</div></div>
      <section aria-labelledby="topic-library-title" className="grid gap-4">
        <h2 id="topic-library-title" className="sr-only">Pustaka materi ajar</h2>
        <div className={styles.toolbar}>
          <p className={styles.count} role="status">{filtered ? `Menampilkan ${number.format(visible.length)} dari ${number.format(data.length)} topik` : `${number.format(data.length)} topik di pustaka sekolah`}</p>
          <label className={styles.search}><Icon name="search" size={16} /><input type="search" aria-label="Cari topik" placeholder="Cari topik materi ajar…" value={query} onChange={event => setQuery(event.target.value)} /></label>
          <Select compact label="Filter pemilik topik" value={ownership} onChange={setOwnership} options={[{ value: 'all', label: 'Semua guru' }, { value: 'mine', label: 'Milik Anda' }, { value: 'colleagues', label: 'Rekan guru' }]} />
          <Select compact label="Urutkan topik" value={sort} onChange={setSort} options={[{ value: 'original', label: 'Urutan awal' }, { value: 'title-asc', label: 'Judul A-Z' }, { value: 'title-desc', label: 'Judul Z-A' }]} />
          {filtered && <button className={styles.reset} type="button" onClick={reset}>Hapus filter</button>}
        </div>
        {visible.length === 0 ? <div className={styles.panel}><NalaEmpty mood="search" title="Tidak ada topik yang cocok" action={<button className={styles.reset} type="button" onClick={reset}>Tampilkan semua topik</button>}>Coba kata kunci lain atau hapus filter.</NalaEmpty></div>
          : <ul className={styles.grid} aria-label="Topik basis pengetahuan">{visible.map(topic => {
            const tone = state(topic), path = `${base}/knowledge-base/${topic.id}`
            return <li key={topic.id} className={styles.card}>
              <div className={styles.cardTop}><span className={styles.status} data-status={tone}>{stateLabel[tone]}</span><span className={styles.owner}>{topic.can_edit ? 'Milik Anda' : `Dari ${topic.owner_name ?? 'rekan guru'}`}</span></div>
              <h3 className={styles.title}><Link to={path}>{topic.topic_title}</Link></h3>
              <div className={styles.tiles}>
                <span className={styles.bar} aria-hidden="true"><span style={{ flexGrow: topic.approved_concept_count }} /><span style={{ flexGrow: topic.pending_count }} /></span>
                <p>{number.format(topic.approved_concept_count)} disetujui · <span data-waiting={topic.pending_count > 0}>{number.format(topic.pending_count)} menunggu tinjauan</span></p>
              </div>
              <p className={styles.meta}><Icon name="file" size={14} />{number.format(topic.material_count)} materi, {number.format(topic.built_section_count)} bab disusun</p>
              <div className={styles.foot}>
                {/* The title link already covers the card; this cue only says what opening it is for. */}
                <span className={styles.next} aria-hidden="true">{topic.can_edit && topic.pending_count > 0 ? 'Tinjau konsep' : 'Buka topik'}<Icon name="chevronRight" size={14} /></span>
                {topic.can_edit && <span className={styles.remove}><ConfirmAction label={<><Icon name="x" size={14} />Hapus</>} title="Hapus topik ini?" description={`${topic.topic_title}. Topik hilang dari pustaka dan namanya bisa dipakai lagi. Misi dan laporan yang sudah memakai konsepnya tetap tersimpan.`} confirm="Hapus topik" pendingLabel="Menghapus…" action={(signal) => kb.deleteTopic(topic.id, signal)} onDone={refresh} refusal={kbRefusal} /></span>}
              </div>
            </li>
          })}</ul>}
      </section>
    </div>
      <aside className={styles.rail} aria-label="Bahan ajar">
        <Link className={styles.upload} to={`${base}/knowledge-base/upload`}><span aria-hidden="true"><Icon name="upload" size={24} /></span><strong>Unggah bahan ajar</strong><small>PDF buku, modul, salindia, atau LKPD. Bab dideteksi otomatis, Anda memilih yang dibangun.</small></Link>
        <section className={styles.share} aria-labelledby="kb-share-title"><h2 id="kb-share-title">Berbagi di sekolah</h2><p>Guru lain di sekolah ini bisa memakai topik milik Anda tanpa mengubahnya. Hanya pemilik yang menyetujui dan mengedit.</p></section>
      </aside>
    </div>}
  </div>
}
