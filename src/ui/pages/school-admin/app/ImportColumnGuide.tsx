import styles from '@/ui/pages/school-admin/ImportFlow.styles'

// The same columns as `rosterColumns`, grouped by who needs them. Rules are the backend's: a student needs a 10-digit NISN and grade 1-12, a teacher an email.
const groups: readonly { title: string; note?: string; columns: readonly (readonly [string, string])[] }[] = [
  { title: 'Semua baris', columns: [['role', 'student atau teacher'], ['full_name', 'Nama lengkap']] },
  { title: 'Siswa', columns: [['nisn', 'Wajib, 10 angka'], ['grade_level', 'Wajib, tingkat 1 sampai 12'], ['class_name', 'Nama kelas, misalnya 8B']] },
  { title: 'Guru', columns: [['email', 'Wajib']] },
  { title: 'Orang tua siswa', note: 'Dibuat dari kolom email orang tua pada baris siswa.', columns: [['parent_email', 'Email orang tua'], ['parent_name', 'Nama orang tua'], ['relationship', 'ayah, ibu, atau wali']] },
]
const after = ['Nalar memeriksa setiap baris.', 'Baris yang benar langsung tersimpan.', 'Undangan masuk dikirim terpisah dari halaman Undangan akun.']

/** What goes in the file. */
export function ImportColumnGuide() {
  return <aside className={styles.guide} aria-labelledby="csv-columns">
    <h2 id="csv-columns" className={styles.guideTitle}>Kolom pada berkas</h2>
    <p className={styles.guideLead}>Baris pertama berisi nama kolom, dipisahkan koma. Satu baris untuk satu orang.</p>
    {groups.map((group) => <div key={group.title} className={styles.group}>
      <h3 className={styles.groupTitle}>{group.title}</h3>
      {group.note && <p className={styles.groupNote}>{group.note}</p>}
      <dl className={styles.columns}>{group.columns.map(([name, rule]) => <div key={name} className={styles.column}><dt className={styles.code}><code>{name}</code></dt><dd className={styles.rule}>{rule}</dd></div>)}</dl>
    </div>)}
  </aside>
}

/** What happens once the file is sent, on the amber road the other Nala pages use. */
export function AfterUpload() {
  return <div className={styles.after}>
    <h3 className={styles.groupTitle}>Setelah diunggah</h3>
    <ul className={styles.afterList}>{after.map((line) => <li key={line}>{line}</li>)}</ul>
  </div>
}
