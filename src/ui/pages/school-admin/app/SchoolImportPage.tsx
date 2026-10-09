import { useCallback, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import { ApiError } from '@/domain/model/ApiError'
import { rosterColumns } from '@/domain/model/SchoolAdmin'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { Select } from '@/ui/components/select/Select'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useCommandSignal, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/school-admin/ImportFlow.styles'
import { AfterUpload, ImportColumnGuide } from './ImportColumnGuide'
import { ImportHistory } from './ImportHistory'
import { ImportResult } from './ImportResult'
import { ImportSteps } from './ImportSteps'
import { RosterFileDrop } from './RosterFileDrop'

const template = `${rosterColumns.join(',')}\nstudent,Adinda Putri,,0098123401,8B,8,ibu.adinda@example.test,Rina Putri,ibu\nteacher,Sari Wulandari,sari@example.test,,,,,,\n`
const refusals: Readonly<Record<string, string>> = { FILE_TOO_LARGE: 'Berkas lebih dari 5 MB.', FILE_NOT_CSV: 'Pilih berkas CSV (.csv).' }

export function SchoolImportPage({ service, schoolId, base }: { service: SchoolAdminUseCases; schoolId: string; base: string }) {
  const read = useCallback((signal: AbortSignal) => service.academicYears(schoolId, signal), [service, schoolId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const commandSignal = useCommandSignal()
  const busy = useRef(false)
  const [year, setYear] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [fileProblem, setFileProblem] = useState('')
  const [pending, setPending] = useState(false)
  const [failure, setFailure] = useState<ApiError | null>(null)
  const [params, setParams] = useSearchParams()
  const importId = params.get('import')
  const chosen = year || data?.find((item) => item.is_current)?.id || ''
  const yearName = data?.find((item) => item.id === chosen)?.name

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
        <p className={styles.lead}>Tambahkan siswa, guru, dan orang tua sekaligus dari satu berkas CSV. Siswa perlu NISN dan tingkat kelas, guru perlu email.</p>
      </div>
      {!importId && <a className={styles.template} href={`data:text/csv;charset=utf-8,${encodeURIComponent(template)}`} download="nalar-impor.csv"><Icon name="file" size={16} />Unduh templat CSV</a>}
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {data && data.length === 0 && <Feedback tone="warning" title="Belum ada tahun ajaran">Hubungi admin platform untuk membuat tahun ajaran sekolah ini.</Feedback>}
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
            onChange={setYear}
            options={(data ?? []).map((item) => ({ value: item.id, label: `${item.name}${item.is_current ? ' (berjalan)' : ''}` }))}
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
      {data && <ImportHistory service={service} schoolId={schoolId} years={data} base={base} />}
    </>}
  </div>
}
