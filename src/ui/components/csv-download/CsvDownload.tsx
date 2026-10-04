import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { useCommand } from '@/ui/pages/live/useLiveResource'

// Saves a CSV the backend writes (UTF-8, spreadsheet-safe) through the signed-in session, so no link carries a token.
export function CsvDownload({ label, filename, read }: { label: string; filename: string; read: (signal?: AbortSignal) => Promise<Blob> }) {
  const command = useCommand()
  async function download() {
    await command.run(async (signal) => {
      const url = URL.createObjectURL(await read(signal))
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
    })
  }
  return <>
    <Button tone="secondary" pending={command.pending} pendingLabel="Mengunduh…" onClick={() => { void download() }}>{label}</Button>
    {command.failure && <Feedback tone="warning" title={command.failure.message} announce />}
  </>
}
