import { useCallback, useEffect } from 'react'
import { jobEnded } from '@/domain/model/KnowledgeBase'
import type { Job } from '@/domain/model/KnowledgeBase'
import type { KnowledgeBaseService } from '@/domain/services/KnowledgeBaseService'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { useLiveResource } from '@/ui/pages/live/useLiveResource'
import { jobFailure } from './kbText'

const jobPollMs = (job: Job | null) => job && jobEnded(job) ? null : 3000
// Per job kind: what is happening, the failure title, the success title and what to do next.
const words: Readonly<Record<string, readonly [string, string, string, string]>> = {
  kb_detect_sections: ['Membaca materi dan daftar babnya', 'Materi gagal dibaca', 'Materi selesai dibaca', 'Pilih bab yang ingin disusun menjadi konsep.'],
  kb_build_section: ['Menyusun konsep dan miskonsepsi dari bab ini, biasanya beberapa menit', 'Bab gagal disusun', 'Bab selesai disusun', 'Tinjau konsep dan miskonsepsi barunya.'],
  mission_generate: ['Menyusun soal pembuka, rubrik, dan bank pertanyaan, biasanya satu sampai dua menit', 'Draf misi gagal disusun', 'Draf misi selesai disusun', 'Periksa isinya, lalu tandai sudah ditinjau.'],
}

// Follows one background job (an upload being read, a chapter build, a mission draft) and tells the page when it ends.
export function JobNotice({ kb, jobId, onDone }: { kb: KnowledgeBaseService; jobId: string; onDone: (job: Job) => void }) {
  const read = useCallback((signal: AbortSignal) => kb.job(jobId, signal), [kb, jobId])
  const { data } = useLiveResource(read, jobPollMs)
  // Reading stops once the job has ended, so this runs once per job.
  useEffect(() => { if (data && jobEnded(data)) onDone(data) }, [data, onDone])
  if (!data) return null
  const [running, failed, done, next] = words[data.kind] ?? ['Sedang diproses', 'Proses gagal', 'Proses selesai', '']
  if (data.status === 'failed') return <Feedback tone="danger" title={failed} announce>{jobFailure[data.error_code ?? ''] ?? 'Coba lagi. Jika tetap gagal, hubungi admin sekolah.'}</Feedback>
  if (data.status !== 'succeeded') return <Feedback title={running} announce>Halaman ini memperbarui sendiri.</Feedback>
  const ungrounded = data.generation_result?.ungrounded_concept_ids.length ?? 0
  return <Feedback tone={ungrounded > 0 ? 'warning' : 'success'} title={done} announce>{ungrounded > 0 ? `${ungrounded} konsep sasaran tidak ditemukan sumbernya di materi. Periksa isinya lebih teliti.` : next}</Feedback>
}
