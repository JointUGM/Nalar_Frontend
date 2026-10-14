import { useState } from 'react'
import type { TeacherService } from '@/domain/services/TeacherService'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { useCommand } from '@/ui/pages/live/useLiveResource'
import dialogStyles from '@/ui/pages/teacher/ReportDialogs.styles'
import { withTeacherNote } from './mgmpNote'

// A file for the subject teachers' meeting (MGMP): this class only, counts only, no student names. Nothing is shared by the app.
// The browser strips the byte-order mark when it reads the text, and spreadsheets need it back to read accents.
const bom = String.fromCharCode(0xfeff)
export function MgmpPackage({ service, publicationId }: { service: TeacherService; publicationId: string }) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')
  const command = useCommand()
  async function download() {
    const done = await command.run(async (signal) => {
      const csv = await (await service.exportMgmpPackage(publicationId, signal)).text()
      const url = URL.createObjectURL(new Blob([bom, withTeacherNote(csv.replace(bom, ''), note)], { type: 'text/csv;charset=utf-8' }))
      const link = document.createElement('a')
      link.href = url
      link.download = 'nalar-paket-mgmp.csv'
      link.click()
      URL.revokeObjectURL(url)
    })
    if (done) setOpen(false)
  }
  return <>
    <Button tone="secondary" onClick={() => { command.reset(); setOpen(true) }}>Siapkan paket MGMP</Button>
    <Dialog open={open} title="Siapkan paket MGMP" description="Berkas CSV berisi miskonsepsi kelas ini dan jejak perbaikannya, tanpa nama siswa. Anda yang memutuskan membagikannya." onClose={() => { if (!command.pending) setOpen(false) }} dismissible={!command.pending}>
      <form onSubmit={(event) => { event.preventDefault(); void download() }}>
        <div className={dialogStyles.area}>
          <label htmlFor="mgmp-note">Aktivitas yang Anda coba (tidak wajib)</label>
          <textarea id="mgmp-note" rows={4} maxLength={2000} value={note} disabled={command.pending} onChange={(event) => setNote(event.target.value)} />
          <p className={dialogStyles.level}>Catatan ini hanya masuk ke berkas yang Anda unduh. NALAR tidak menyimpannya.</p>
        </div>
        {command.failure && <Feedback tone="warning" title={command.failure.message} announce />}
        <div className={dialogStyles.actions}><Button tone="secondary" disabled={command.pending} onClick={() => setOpen(false)}>Batal</Button><Button type="submit" pending={command.pending} pendingLabel="Menyiapkan…">Unduh paket</Button></div>
      </form>
    </Dialog>
  </>
}
