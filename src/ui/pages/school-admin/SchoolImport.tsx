import { useRef } from 'react'
import { AdultShell } from '@/ui/components/adult-shell/AdultShell'
import { Button } from '@/ui/components/button/Button'
import { Field } from '@/ui/components/field/Field'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { csvColumns, csvSample } from './csvPreview'
import { schoolExample } from './peopleExamples'
import { useSchoolImportViewModel } from './useSchoolImportViewModel'
import styles from './SchoolImport.module.css'

const descriptions = ['siswa, guru, atau orang_tua', 'Nama lengkap', 'Wajib untuk siswa · 10 digit, simpan sebagai teks', 'Kosongkan jika orang tua tidak punya email', 'Contoh: 8B', 'NISN anak untuk menautkan orang tua']

export function SchoolImport() {
  const view = useSchoolImportViewModel()
  const inputRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const cleanCount = view.preview?.rows.filter((row) => !row.issues.length).length ?? 0
  function reset() { view.reset(); inputRef.current?.querySelector('input')?.focus() }
  return <AdultShell schoolContext={schoolExample}><div className={styles.content}>
    <h1>Impor data siswa, guru, dan orang tua</h1>
    <ol className={styles.steps} aria-label="Tahapan impor">{['Pilih file', 'Periksa', 'Selesai'].map((label, i) => <li key={label} aria-current={(view.preview ? 1 : 0) === i ? 'step' : undefined}><span>{i + 1}</span>{label}</li>)}</ol>
    <p className={styles.note}>Pratinjau lokal · gunakan data fiktif. File hanya dibaca di browser, tanpa unggahan atau perubahan data sekolah.</p>
    {!view.preview ? <div className={styles.grid}>
      <section className={styles.card} aria-label="Pilih CSV contoh">
        <div ref={inputRef} className={styles.dropzone} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const file = event.dataTransfer.files[0]; if (file) { void view.selectFile(file) } }}>
          <Icon name="upload" size={24} /><strong>Tarik file CSV contoh ke sini</strong><span>Satu baris per orang · maksimal 100 KB / 200 baris</span>
          <Field label="Pilih file CSV contoh" type="file" accept=".csv,text/csv" onChange={(event) => { const file = event.target.files?.[0]; if (file) void view.selectFile(file); event.target.value = '' }} />
        </div>
        <div className={styles.actions}><Button tone="secondary" onClick={view.selectSample}>Gunakan file contoh</Button></div>
        <div role="status">{view.reading ? <p>Membaca file di browser…</p> : view.file && <div className={styles.file}><Icon name="book" /><span><strong>{view.file.name}</strong><small>Terpilih untuk pemeriksaan lokal</small></span></div>}</div>
        {view.error && <Feedback tone="danger" title={view.error} announce />}
        <div className={styles.actions}><Button disabled={!view.file || view.reading} onClick={() => { view.inspect(); requestAnimationFrame(() => headingRef.current?.focus()) }}>Periksa file</Button>{view.file && <Button tone="ghost" onClick={reset}>Hapus pilihan</Button>}</div>
      </section>
      <section className={styles.card} aria-labelledby="csv-columns"><div className={styles.cardHeading}><h2 id="csv-columns">Kolom yang dibaca</h2><a className={styles.download} href={`data:text/csv;charset=utf-8,${encodeURIComponent(csvSample.split('\n').slice(0, 5).join('\r\n') + '\r\n')}`} download="templat-roster-contoh.csv">Templat CSV contoh</a></div><dl className={styles.columns}>{csvColumns.map((column, i) => <div key={column}><dt><code>{column}</code></dt><dd>{descriptions[i]}</dd></div>)}</dl><p className={styles.note}>UTF-8 · pemisah koma. Templat berisi empat orang fiktif. Gunakan tanda kutip untuk nilai yang berisi koma.</p></section>
    </div> : <section className={styles.preview} aria-labelledby="csv-preview">
      <h2 id="csv-preview" ref={headingRef} tabIndex={-1}>Pemeriksaan format lokal</h2><p className={styles.filename}>{view.file?.name}</p>
      {view.preview.error ? <Feedback tone="danger" title="Format file belum dapat dibaca" announce>{view.preview.error}</Feedback> : !view.preview.rows.length ? <Feedback title="File belum berisi orang" announce>Isi baris data setelah judul kolom, lalu pilih ulang file.</Feedback> : <>
        <div className={styles.summary} role="status"><div><span>Baris dibaca</span><strong>{view.preview.rows.length}</strong></div><div><span>Tanpa masalah format</span><strong>{cleanCount}</strong></div><div><span>Perlu diperbaiki</span><strong>{view.preview.rows.length - cleanCount}</strong></div></div>
        <p className={styles.note}>Pemeriksaan hanya mencakup kolom, peran, nama, dan format NISN. Email, kelas, duplikasi, dan tautan anak belum diverifikasi. Belum ada baris yang diimpor.</p>
        <div className={styles.tableRegion} role="region" aria-label="Pratinjau baris CSV" tabIndex={0}><table><caption>Baris file dan masalah format</caption><thead><tr><th scope="col">Baris</th><th scope="col">Peran · nama</th><th scope="col">NISN · email</th><th scope="col">Kelas · NISN anak</th><th scope="col">Format</th></tr></thead><tbody>{view.preview.rows.map((row) => <tr key={row.line}><td>{row.line}</td><td>{row.values[0] || '—'}<strong>{row.values[1] || '—'}</strong></td><td>{row.values[2] || '—'}<span>{row.values[3] || '—'}</span></td><td>{row.values[4] || '—'}<span>{row.values[5] || '—'}</span></td><td>{row.issues.length ? <ul>{row.issues.map((issue) => <li key={issue}>{issue}</li>)}</ul> : 'Tanpa masalah format'}</td></tr>)}</tbody></table></div>
      </>}
      <div className={styles.actions}><Button tone="secondary" onClick={() => { view.back(); requestAnimationFrame(() => inputRef.current?.querySelector('input')?.focus()) }}>Kembali ke pilihan file</Button><Button disabled title="Pemrosesan simulasi belum tersedia">Lanjutkan impor simulasi</Button></div><p className={styles.note}>Pemrosesan dan hasil impor simulasi belum tersedia pada pratinjau ini.</p>
    </section>}
  </div></AdultShell>
}
