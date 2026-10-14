import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import { ApiError } from '@/domain/model/ApiError'
import { rosterColumns } from '@/domain/model/SchoolAdmin'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { Select } from '@/ui/components/select/Select'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { useCommandSignal } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/school-admin/ImportFlow.styles'
import { AfterUpload, ImportColumnGuide } from './ImportColumnGuide'
import { ImportHistory } from './ImportHistory'
import { ImportResult } from './ImportResult'
import { ImportSteps } from './ImportSteps'
import { RosterFileDrop } from './RosterFileDrop'
import { useAcademicYears } from './useAcademicYears'

const template = `${rosterColumns.join(',')}\nstudent,Adinda Putri,,0098123401,8B,8,ibu.adinda@example.test,Rina Putri,ibu\nteacher,Sari Wulandari,sari@example.test,,,,,,\n`
const refusals: Readonly<Record<string, string>> = { FILE_TOO_LARGE: 'Berkas lebih dari 5 MB.', FILE_NOT_CSV: 'Pilih berkas CSV (.csv).' }

export function SchoolImportPage({ service, schoolId, base }: { service: SchoolAdminUseCases; schoolId: string; base: string }) {
  const years = useAcademicYears(service, schoolId)
  const commandSignal = useCommandSignal()
  const busy = useRef(false)
  const [chosenYear, setChosenYear] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [fileProblem, setFileProblem] = useState('')
  const [pending, setPending] = useState(false)
  const [failure, setFailure] = useState<ApiError | null>(null)
  const [params, setParams] = useSearchParams()
  const importId = params.get('import')
  const chosen = chosenYear || (years.list.some((item) => item.id === chosenYear) ? chosenYear : years.yearId)
  const yearName = years.list.find((item) => item.id === chosen)?.name

  async function upload() {
    if (busy.current || !file || !chosen) return
    busy.current = true; setPending(true); setFailure(null)
    const signal = commandSignal()
    try {
      const queued = await service.uploadRoster(schoolId, chosen, file, signal)
      if (!signal?.aborted) setParams({ import: queued.import_id })
    } catch (cause) {
      if (!signal?.aborted) setFailure(cause instanceof ApiError ? cause : new ApiError(0, 'UNAVAILABLE'))
    } finally { busy.current = false; if (!signal?.aborted) setPending(false) }
  }
  const pick = (next: File) => { setFile(next); setFileProblem(''); setFailure(null) }
  const remove = () => { setFile(null); setFileProblem(''); setFailure(null) }
  const barText = pending ? 'Mengunggah berkas…' : !chosen ? 'Pilih tahun ajaran terlebih dahulu.' : !file ? 'Pilih berkas CSV untuk melanjutkan.' : `Siap diimpor ke tahun ajaran ${yearName}.`

  return <div className={styles.content}>
    <div className={styles.head}>
      <div className={styles.headText}>
        <h1 className={styles.title}>Impor data siswa dan guru</h1>
        <p className={styles.lead}>Tambahkan siswa dan guru sekaligus dari satu berkas CSV. Siswa perlu NISN dan tingkat kelas, guru perlu email.</p>
      </div>
      {!importId && <a className={styles.template} href={`data:text/csv;charset=utf-8,${encodeURIComponent(template)}`} download="nalar-impor.csv"><Icon name="file" size={16} />Unduh templat CSV</a>}
    </div>
    <LiveFeedback error={years.error} online={true} refresh={years.refresh} />
    {years.loaded && years.list.length === 0 && <Feedback tone="warning" title="Belum ada tahun ajaran">Hubungi admin platform untuk membuat tahun ajaran sekolah ini.</Feedback>}
    {importId ? <ImportResult key={importId} service={service} importId={importId} base={base} /> : <>
      <ImportSteps at={0} />
      <div className={styles.layout}>
        <div className={styles.main}>
        <section className={styles.workspace} aria-label="Unggah berkas CSV">
          <Select
            className={styles.yearField}
            label="Tahun ajaran"
            value={chosen}
            disabled={pending}
            placeholder="Pilih tahun ajaran"
            onChange={(val) => { setChosenYear(val); years.choose(val) }}
            options={years.list.map((item) => ({ value: item.id, label: `${item.name}${item.id === years.activeYearId ? ' (berjalan)' : ''}` }))}
          />
          <RosterFileDrop file={file} pending={pending} error={fileProblem} failed={Boolean(failure)} onPick={pick} onReject={setFileProblem} onRemove={remove} />
          {failure && <Feedback tone="warning" title={refusals[failure.code] ?? failure.message} announce>{failure.requestId && <small>Referensi: {failure.requestId}</small>}</Feedback>}
          <div className={styles.bar}>
            <p role="status" className={styles.barText}>{barText}</p>
            <Button className={styles.submit} pending={pending} pendingLabel="Mengunggah…" disabled={!file || !chosen} onClick={() => { void upload() }}><Icon name="upload" size={16} />Unggah dan impor</Button>
          </div>
        </section>
        <AfterUpload />
        </div>
        <ImportColumnGuide />
      </div>
      {years.list.length > 0 && <ImportHistory service={service} schoolId={schoolId} years={years.list} base={base} />}
    </>}
  </div>
}
