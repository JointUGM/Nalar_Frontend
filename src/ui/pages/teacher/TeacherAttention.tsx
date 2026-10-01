import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Icon } from '@/ui/components/icon/Icon'
import { TeacherShell } from '@/ui/components/teacher-shell/TeacherShell'
import { severity } from './teacherAttentionExamples'
import type { AttentionItem } from './teacherAttentionExamples'
import { teacherUser } from './teacherHomeExamples'
import { generatedMissionId, missionsPath } from './teacherMissionExamples'
import { reportExample } from './teacherReportExamples'
import { studentNames } from './teacherSessionExamples'
import { attentionTabs, decisionLabels, useTeacherAttentionViewModel } from './useTeacherAttentionViewModel'
import type { AttentionDecision } from './useTeacherAttentionViewModel'
import styles from './TeacherAttention.module.css'

const reportStudent = studentNames[reportExample.studentIndex]
const initials = (name: string) => name.split(' ').map((part) => part[0]).join('')
const stats = [['safety', 'Keselamatan', 'Sesi dijeda, perlu Anda hampiri'], ['flag', 'Perlu verifikasi', 'Dari aturan, bukan tebakan AI'], ['approve', 'Menunggu persetujuan', 'Basis pengetahuan dan misi'], ['reviewed', 'Sudah ditinjau', 'Minggu ini']] as const

export function TeacherAttention() {
  const view = useTeacherAttentionViewModel()
  const [announcement, setAnnouncement] = useState('')
  const detail = useRef<HTMLElement>(null)
  const { selected } = view
  const decision = selected ? view.decisions[selected.id] : undefined

  function choose(id: string) {
    view.select(id)
    // Stacked layout: the detail sits below the list, so move there to show that the choice took effect.
    if (window.matchMedia?.('(max-width: 900px)').matches) detail.current?.focus()
  }
  function decide(item: AttentionItem, next: AttentionDecision) {
    view.decide(item.id, next)
    setAnnouncement(`${item.name}: ${decisionLabels[next].toLowerCase()}. Dipindahkan ke Sudah ditinjau.`)
    detail.current?.focus()
  }
  function reopen(item: AttentionItem) {
    view.reopen(item.id)
    setAnnouncement(`${item.name}: dikembalikan ke daftar terbuka.`)
    detail.current?.focus()
  }

  return <TeacherShell title="Perlu perhatian" user={teacherUser}><div className={styles.content}>
    <div className={styles.header}>
      <div><h1>Perlu perhatian</h1><p>Keselamatan siswa, catatan verifikasi, dan hal yang menunggu persetujuan Anda.</p></div>
      <Link className={styles.primary} to={`${missionsPath}/${generatedMissionId}/class-map?kelas=8B`}><Icon name="graph" size={14} />Buka peta kelas</Link>
    </div>
    <p className={styles.note}>Pratinjau lokal · catatan, waktu, dan saran adalah contoh tetap; tidak ada yang dihitung atau ditulis AI di sini. Keputusan Anda hanya berlaku di halaman ini dan tidak mengubah skor.</p>
    <ul className={styles.stats} aria-label="Ringkasan catatan">{stats.map(([key, label, caption]) => <li key={key}>
      <strong>{view.counts[key]} {label}</strong><small>{caption}</small>
    </li>)}</ul>
    <p role="status" className={styles.announce}>{announcement}</p>

    <section className={styles.card} aria-labelledby="attention-notes">
      <h2 id="attention-notes" className={styles.hidden}>Catatan</h2>
      <div className={styles.tabs} role="group" aria-label="Jenis catatan">{attentionTabs.map(([key, label]) => <button key={key} type="button" aria-pressed={view.tab === key} onClick={() => view.setTab(key)}>{label} ({view.counts[key]})</button>)}</div>
      <div className={styles.tools}>
        <p>{view.tab === 'reviewed' ? `Total ${view.counts.reviewed} catatan · hanya keputusan Anda di halaman ini yang dirinci` : `Total ${view.visible.length} catatan`}</p>
        <label className={styles.search}><Icon name="search" size={14} /><input type="search" aria-label="Cari catatan" placeholder="Cari catatan" value={view.query} onChange={(event) => view.setQuery(event.target.value)} /></label>
      </div>
      <div className={styles.split}>
        <div className={styles.list}>
          {view.visible.length === 0 ? <p className={styles.empty}>{view.query ? 'Tidak ada catatan yang cocok.' : view.tab === 'reviewed' ? 'Belum ada keputusan di halaman ini. Contoh hanya memuat catatan yang masih terbuka.' : 'Tidak ada catatan terbuka di kategori ini.'}</p>
            : <ul aria-label="Daftar catatan">{view.visible.map((item) => <li key={item.id}>
              <button type="button" className={styles.row} aria-pressed={selected?.id === item.id} onClick={() => choose(item.id)}>
                <span className={styles.rowHead}>
                  <span className={styles.sev} data-kind={item.kind}><Icon name={severity[item.kind].icon} size={10} />{severity[item.kind].label}</span>
                  <span aria-hidden="true">•</span><span className={styles.context}>{item.context}</span><span className={styles.when}>{item.when}</span>
                </span>
                <span className={styles.who}><span className={styles.avatar} data-kind={item.kind} aria-hidden="true">{initials(item.name)}</span><span><strong>{item.name}</strong><small>{item.title}</small></span></span>
                <span className={styles.summary}>{item.summary}</span>
                <span className={styles.meta}><span>{item.metaLeft}</span><span className={styles.info}><Icon name="info" size={12} />{item.metaRight}</span>{view.decisions[item.id] ? <b>{decisionLabels[view.decisions[item.id]]}</b> : <span className={styles.more}>Lihat detail</span>}</span>
              </button>
            </li>)}</ul>}
        </div>
        <section ref={detail} tabIndex={-1} className={styles.detail} aria-label="Detail catatan">
          {!selected ? <p className={styles.empty}>Pilih catatan untuk melihat detail.</p> : <>
            <p className={styles.sev} data-kind={selected.kind}><Icon name={severity[selected.kind].icon} size={10} />{severity[selected.kind].label}</p>
            <div className={styles.who}><span className={styles.avatar} data-kind={selected.kind} aria-hidden="true">{initials(selected.name)}</span><div><h3>{selected.name}</h3><small>{selected.context}</small></div></div>
            <dl className={styles.metrics}>
              <div><dt>{selected.kind === 'approve' ? 'PROGRES DRAF' : 'PROGRES SESI'}</dt><dd>
                <span className={styles.progress}><span aria-hidden="true"><i style={{ inlineSize: `${selected.progress.percent}%` }} /></span>{selected.progress.label}</span>
                <small>{selected.progress.text}</small></dd></div>
              <div><dt>AKTIVITAS TERAKHIR</dt><dd><strong>{selected.last.value}</strong><small>{selected.last.caption}</small></dd></div>
              <div><dt>SINYAL</dt><dd><strong data-kind={selected.kind}>{selected.signal.value}</strong><small>{selected.signal.caption}</small></dd></div>
            </dl>
            <h4>CATATAN</h4>
            <p>{selected.note}</p>
            <div className={styles.box}><p><Icon name="sparkle" size={13} />{selected.boxTitle}</p><p>{selected.box}</p></div>
            <h4>BUKTI</h4>
            <ul className={styles.evidence}>{selected.evidence.map((line) => <li key={line}><Icon name="chevronRight" size={12} />{line}</li>)}</ul>
            <div className={styles.actions}>{decision
              ? <><p>Ditinjau: {decisionLabels[decision].toLowerCase()}. Hanya catatan Anda di pratinjau ini; tidak ada yang dikirim atau diubah.</p><Button tone="secondary" onClick={() => reopen(selected)}>Kembalikan ke daftar</Button></>
              : selected.kind === 'safety' ? <Button onClick={() => decide(selected, 'handled')}>Sudah saya tangani</Button>
              : selected.kind === 'approve' ? <Link className={styles.primary} to="/review/teacher/knowledge-base/tekanan-zat">Tinjau sekarang</Link>
              : <>
                {selected.name === reportStudent
                  ? <Link className={styles.primary} to={`${missionsPath}/${generatedMissionId}/class-map/report?kelas=8B`}>Buka laporan</Link>
                  : <Button disabled title={`Contoh laporan hanya tersedia untuk ${reportStudent}`}>Buka laporan</Button>}
                <Button tone="secondary" onClick={() => decide(selected, 'clear')}>Tidak ada masalah</Button>
                <Button tone="secondary" onClick={() => decide(selected, 'discuss')}>Perlu dibahas</Button>
              </>}</div>
          </>}
        </section>
      </div>
    </section>
  </div></TeacherShell>
}
