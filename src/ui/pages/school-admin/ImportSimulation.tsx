import { useEffect, useRef } from 'react'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import type { CsvPreviewRow } from './csvPreview'
import { schoolExample } from './peopleExamples'
import { useImportSimulationViewModel } from './useImportSimulationViewModel'
import type { ImportPhase } from './useImportSimulationViewModel'
import styles from './SchoolImport.module.css'

export function ImportSimulation({ rows, filename, onBack, onReset, onPhaseChange }: { rows: CsvPreviewRow[]; filename: string; onBack: () => void; onReset: () => void; onPhaseChange: (phase: ImportPhase) => void }) {
  const eligible = rows.filter((row) => !row.issues.length)
  const rejected = rows.length - eligible.length
  const parents = eligible.filter((row) => row.values[0] === 'orang_tua' && !row.values[3])
  const view = useImportSimulationViewModel(eligible.length)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const actionRef = useRef<HTMLDivElement>(null)
  const previousPhase = useRef(view.phase)
  useEffect(() => {
    onPhaseChange(view.phase)
    if (view.phase !== previousPhase.current) {
      if (['queued', 'running', 'success'].includes(view.phase)) headingRef.current?.focus()
      if (view.phase === 'idle' && previousPhase.current !== 'confirming') actionRef.current?.querySelector('button')?.focus()
      if (view.phase === 'failure') headingRef.current?.focus()
    }
    previousPhase.current = view.phase
  }, [view.phase, onPhaseChange])

  if (view.phase === 'queued' || view.phase === 'running') return <section className={styles.processing} aria-label="Pemrosesan impor simulasi">
    <h2 ref={headingRef} tabIndex={-1}>{view.phase === 'queued' ? 'Simulasi dalam antrean' : 'Simulasi sedang diproses'}</h2>
    <Feedback title={view.phase === 'queued' ? 'Menunggu langkah pratinjau berikutnya' : 'Pemrosesan contoh berjalan'} announce>{eligible.length} baris tanpa masalah format · {filename}</Feedback>
    <p className={styles.note}>Skenario dikendalikan dengan tombol di bawah. Tidak ada pekerjaan server, persentase kemajuan, unggahan, atau perubahan data sekolah.</p>
    <div className={styles.actions}><Button disabled>Impor simulasi berlangsung</Button>{view.phase === 'queued' ? <Button onClick={view.run}>Mulai pemrosesan contoh</Button> : <Button onClick={view.finish}>Tampilkan hasil {view.outcome === 'success' ? 'selesai' : 'gagal'}</Button>}<Button tone="secondary" onClick={view.cancel}>Batalkan simulasi</Button></div>
  </section>

  if (view.phase === 'success') return <section aria-label="Hasil impor simulasi">
    <div className={styles.grid}>
      <div className={styles.card}>
        <span className={styles.resultMark} aria-hidden="true">✓</span><h2 className={styles.resultTitle} ref={headingRef} tabIndex={-1}>Simulasi impor selesai</h2>
        <p className={styles.filename}>{filename}</p>
        <Feedback tone={rejected ? 'warning' : 'success'} title={rejected ? `${eligible.length} baris selesai · ${rejected} baris dilewati dalam simulasi` : `${eligible.length} baris selesai dalam simulasi`} announce>Data sekolah dan daftar Orang tidak berubah. Tidak ada akun atau tautan aktivasi yang dibuat.</Feedback>
        <dl className={styles.resultCounts}>{[['Siswa', 'siswa'], ['Guru', 'guru'], ['Orang tua', 'orang_tua']].map(([label, role]) => <div key={role}><dt>{label}</dt><dd>{eligible.filter((row) => row.values[0] === role).length}</dd></div>)}<div><dt>Baris dilewati karena format</dt><dd>{rejected}</dd></div></dl>
      </div>
      <div className={styles.card}><h2>{parents.length} orang tua tanpa email · contoh</h2><p className={styles.note}>Ringkasan dari baris tanpa masalah format pada file ini. Tautan anak dan akses akun belum diverifikasi.</p>
        {parents.length ? <ul className={styles.parentList}>{parents.map((row) => <li key={row.line}><strong>{row.values[1]}</strong><span>NISN anak: {row.values[5] || 'Belum diisi'}</span></li>)}</ul> : <p className={styles.note}>Tidak ada orang tua tanpa email pada baris yang disertakan dalam simulasi.</p>}
        <Button tone="secondary" disabled title="Kode aktivasi dan cetak slip belum tersedia">Cetak slip aktivasi</Button><p className={styles.note}>Kode aktivasi dan pencetakan belum tersedia. Pratinjau ini tidak menghasilkan kode akses.</p>
      </div>
    </div><div className={styles.actions}><Button tone="secondary" onClick={view.review}>Tinjau baris file</Button><Button onClick={onReset}>Pilih file lain</Button></div>
  </section>

  return <div ref={actionRef}>
    {view.phase === 'failure' && <section className={styles.processing}><h2 ref={headingRef} tabIndex={-1}>Simulasi impor gagal</h2><Feedback tone="danger" title="Contoh pemrosesan tidak selesai" announce>File dan pemeriksaan format tetap tersimpan selama halaman ini terbuka. Tidak ada baris yang diubah atau diimpor.</Feedback></section>}
    <div className={styles.actions}><Button tone="secondary" onClick={onBack}>Kembali ke pilihan file</Button><Button disabled={!eligible.length} onClick={view.open}>{view.phase === 'failure' ? 'Coba simulasi lagi' : 'Lanjutkan impor simulasi'}</Button></div>
    <p className={styles.note}>{eligible.length ? `${eligible.length} baris akan disertakan dalam simulasi; ${rejected} baris dengan masalah format akan dilewati.` : 'Perbaiki format file sebelum menjalankan simulasi.'} Pemeriksaan email, kelas, duplikasi, dan tautan anak belum dilakukan.</p>
    {view.phase === 'confirming' && <Dialog open onClose={view.dismiss} title="Konfirmasi impor simulasi" description={`${schoolExample.name} · ${schoolExample.year}. Hanya menampilkan hasil contoh; data sekolah tidak berubah.`}>
      <p className={styles.filename}>{filename}</p><p>{eligible.length} baris disertakan · {rejected} baris dilewati karena masalah format.</p>
      <label className={styles.scenario}>Hasil skenario<select value={view.outcome} onChange={(event) => view.setOutcome(event.target.value as 'success' | 'failure')}><option value="success">Selesai (baris bermasalah dilewati)</option><option value="failure">Pemrosesan gagal</option></select></label>
      <p className={styles.note}>Antrean dan pemrosesan dikendalikan secara manual untuk meninjau tampilan. Tidak ada unggahan, pencocokan akun, atau pengiriman undangan.</p>
      <div className={styles.actions}><Button tone="secondary" onClick={view.dismiss}>Batal</Button><Button onClick={view.confirm}>Jalankan simulasi</Button></div>
    </Dialog>}
  </div>
}
