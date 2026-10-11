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
const statusOptions = [{ value: 'all', label: 'Semua status' }, { value: 'review', label: stateLabel.review }, { value: 'approved', label: stateLabel.approved }, { value: 'empty', label: stateLabel.empty }]
const perPageOptions = ['10', '25', '50'].map((value) => ({ value, label: `${value} baris` }))
const titleOrder = new Intl.Collator('id-ID', { numeric: true, sensitivity: 'base' })
const number = new Intl.NumberFormat('id-ID')

export function TeacherKbListPage({ kb, base, schoolId }: { kb: KnowledgeBaseService; base: string; schoolId: string }) {
  const read = useCallback((signal: AbortSignal) => kb.list(schoolId, signal), [kb, schoolId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const [query, setQuery] = useState(''), [filter, setFilter] = useState<'all' | TopicState>('all')
  const [ownership, setOwnership] = useState('all'), [sort, setSort] = useState('original')
  const [page, setPage] = useState(0), [perPage, setPerPage] = useState('10')
  const visible = (data ?? []).filter(topic => (filter === 'all' || state(topic) === filter)
    && (ownership === 'all' || topic.can_edit === (ownership === 'mine'))
    && topic.topic_title.toLocaleLowerCase('id-ID').includes(query.trim().toLocaleLowerCase('id-ID')))
  if (sort !== 'original') visible.sort((a, b) => titleOrder.compare(a.topic_title, b.topic_title) * (sort === 'title-desc' ? -1 : 1))
  const filtered = Boolean(query.trim()) || filter !== 'all' || ownership !== 'all'
  // Any change to what is listed starts again from the first page.
  const first = (set: (value: string) => void) => (value: string) => { set(value); setPage(0) }
  function reset() { setQuery(''); setFilter('all'); setOwnership('all'); setPage(0) }
  const size = Number(perPage), pageCount = Math.max(1, Math.ceil(visible.length / size)), current = Math.min(page, pageCount - 1)
  const rows = visible.slice(current * size, (current + 1) * size)
  const firstPage = Math.min(Math.max(current - 2, 0), Math.max(pageCount - 5, 0))
  const waiting = data?.filter((topic) => topic.pending_count > 0).length ?? 0

  return <div className={styles.page}>
    <TeacherPageHead title="Basis pengetahuan" subtitle={data && data.length > 0 ? `${number.format(data.length)} topik${waiting > 0 ? `, ${number.format(waiting)} menunggu tinjauan` : ''}. Hanya konsep yang Anda setujui dipakai untuk misi.` : 'Unggah materi ajar, tinjau konsepnya, lalu gunakan yang disetujui untuk misi.'} />
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <section className={styles.panel}><div className={styles.state}><Loading label="Memuat basis pengetahuan…" /></div></section>}
    {!data && error && <section className={styles.panel}><NalaEmpty mood="oops" title="Basis pengetahuan belum dapat ditampilkan">Coba muat ulang melalui pilihan di atas.</NalaEmpty></section>}
    {data && data.length === 0 && <section className={styles.panel}><NalaEmpty mood="ask" title="Belum ada basis pengetahuan" action={<ButtonLink tone="secondary" className={styles.button} to={`${base}/knowledge-base/upload`}><Icon name="upload" size={16} />Unggah materi pertama</ButtonLink>}>
      Unggah materi ajar (PDF) untuk memulai topik pertama.
    </NalaEmpty></section>}
    {data && data.length > 0 && <section className={styles.panel} aria-labelledby="topic-library-title">
      <h2 id="topic-library-title" className="sr-only">Pustaka materi ajar</h2>
      <div className={styles.filters}>
        <label className={styles.search}><Icon name="search" size={16} /><input type="search" aria-label="Cari topik" placeholder="Cari topik materi ajar…" value={query} onChange={event => { setQuery(event.target.value); setPage(0) }} /></label>
        <Select compact label="Filter status topik" value={filter} onChange={first((value) => setFilter(value as 'all' | TopicState))} options={statusOptions} />
        <Select compact label="Filter pemilik topik" value={ownership} onChange={first(setOwnership)} options={[{ value: 'all', label: 'Semua guru' }, { value: 'mine', label: 'Milik Anda' }, { value: 'colleagues', label: 'Rekan guru' }]} />
        <Select compact label="Urutkan topik" value={sort} onChange={first(setSort)} options={[{ value: 'original', label: 'Urutan awal' }, { value: 'title-asc', label: 'Judul A-Z' }, { value: 'title-desc', label: 'Judul Z-A' }]} />
        {filtered && <button className={styles.reset} type="button" onClick={reset}>Hapus filter</button>}
        <ButtonLink className={styles.upload} to={`${base}/knowledge-base/upload`}><Icon name="upload" size={16} />Unggah bahan ajar</ButtonLink>
      </div>
      <p className={styles.count} role="status">{filtered ? `Menampilkan ${number.format(visible.length)} dari ${number.format(data.length)} topik` : `${number.format(data.length)} topik di pustaka sekolah`}</p>
      {visible.length === 0 ? <NalaEmpty mood="search" title="Tidak ada topik yang cocok" action={<button className={styles.reset} type="button" onClick={reset}>Tampilkan semua topik</button>}>Coba kata kunci lain atau hapus filter.</NalaEmpty> : <>
        <div className={styles.scroll}><table className={styles.table} aria-label="Topik basis pengetahuan">
          <thead><tr><th scope="col">Topik</th><th scope="col">Status</th><th scope="col">Konsep</th><th scope="col" data-extra>Pemilik</th><th scope="col"><span className="sr-only">Aksi</span></th></tr></thead>
          <tbody>{rows.map(topic => {
            const tone = state(topic), path = `${base}/knowledge-base/${topic.id}`
            return <tr key={topic.id}>
              <td><div className={styles.topic}><Link to={path}>{topic.topic_title}</Link><small>{number.format(topic.material_count)} materi, {number.format(topic.built_section_count)} bab disusun</small></div></td>
              <td><span className={styles.status} data-status={tone}>{stateLabel[tone]}</span></td>
              <td><div className={styles.coverage}>
                <span className={styles.bar} aria-hidden="true"><span style={{ flexGrow: topic.approved_concept_count }} /><span style={{ flexGrow: topic.pending_count }} /></span>
                <span>{number.format(topic.approved_concept_count)} disetujui{topic.pending_count > 0 ? <b> · {number.format(topic.pending_count)} menunggu</b> : ' · 0 menunggu'}</span>
              </div></td>
              <td data-extra className={styles.owner}>{topic.can_edit ? 'Milik Anda' : topic.owner_name ?? 'Rekan guru'}</td>
              <td><div className={styles.actions}>
                <Link to={path}>{topic.can_edit && topic.pending_count > 0 ? 'Tinjau' : 'Lihat isi'}</Link>
                {topic.can_edit && <Link to={`${path}#kb-sources`}>Tambah bab</Link>}
                {topic.can_edit && <span className={styles.remove}><ConfirmAction label={<><Icon name="x" size={14} />Hapus</>} title="Hapus topik ini?" description={`${topic.topic_title}. Topik hilang dari pustaka dan namanya bisa dipakai lagi. Misi dan laporan yang sudah memakai konsepnya tetap tersimpan.`} confirm="Hapus topik" pendingLabel="Menghapus…" action={(signal) => kb.deleteTopic(topic.id, signal)} onDone={refresh} refusal={kbRefusal} /></span>}
              </div></td>
            </tr>
          })}</tbody>
        </table></div>
        <div className={styles.foot}>
          <span>Menampilkan {number.format(current * size + 1)}-{number.format(current * size + rows.length)} dari {number.format(visible.length)} topik</span>
          <div>
            <span className={styles.perPage}><Select compact label="Baris per halaman" value={perPage} onChange={first(setPerPage)} options={perPageOptions} /></span>
            {pageCount > 1 && <nav className={styles.pager} aria-label="Halaman topik">
              <button type="button" className={styles.pageButton} aria-label="Halaman sebelumnya" disabled={current === 0} onClick={() => setPage(current - 1)}><Icon name="chevronLeft" size={16} /></button>
              {Array.from({ length: Math.min(5, pageCount) }, (_, index) => firstPage + index).map((index) => <button key={index} type="button" className={styles.pageButton} aria-label={`Halaman ${index + 1}`} aria-current={index === current ? 'page' : undefined} onClick={() => setPage(index)}>{index + 1}</button>)}
              <button type="button" className={styles.pageButton} aria-label="Halaman berikutnya" disabled={current >= pageCount - 1} onClick={() => setPage(current + 1)}><Icon name="chevronRight" size={16} /></button>
            </nav>}
          </div>
        </div>
      </>}
    </section>}
    {data && data.length > 0 && <p className={styles.note}>Guru lain di sekolah ini bisa memakai topik milik Anda tanpa mengubahnya. Hanya pemilik yang menyetujui dan mengedit. Bab dari PDF yang Anda unggah dideteksi otomatis, Anda memilih yang dibangun.</p>}
  </div>
}
