import { ApiError } from './ApiError'

export interface LiveClock { server_now: string }
export interface LiveJoin {
  run_id: string
  participant_id: string
  publication_id: string
  mission_title: string
  run_status: string
  session_id: string | null
  warmup: { prompt: string; choices: { id: string; text: string }[] } | null
  deadline_at: string | null
}
export interface LiveLobby extends LiveClock {
  run_status: string
  participant_status: string
  warmup_choice_id: string | null
  session_id: string | null
  started_at: string | null
  deadline_at: string | null
}
export interface LiveState extends LiveClock {
  status: string
  turn_index: number
  probe_number: number
  probe_total: number
  started_at: string
  deadline_at: string
  prompt: { kind: string; text: string; turn_index: number } | null
  safety_message: string | null
  reflection_ready: boolean
}
export interface LiveStudent {
  student_id: string
  name: string
  status: string
  current_turn_index: number | null
  max_turns: number
  deadline_at: string | null
  open_flag_count: number
  safety_paused: boolean
  // The student's latest session in this run; it opens the teacher report.
  session_id: string | null
  // Set once the student has joined; it removes a waiting student from the lobby.
  participant_id: string | null
}
export interface LiveMonitor extends LiveClock {
  run: { id: string; mode: string; status: string; join_code: string | null; started_at: string | null }
  waiting_count: number
  students: LiveStudent[]
}
export interface LivePublication {
  id: string
  class_id: string
  class_name: string
  mission_title: string
  run: { id: string; mode: string; status: string; join_code: string | null }
}
export interface LivePublications { items: LivePublication[]; next_cursor: string | null }
export interface LiveReflection {
  mission_title: string
  completed_at: string | null
  content: string
  opening_guess: { choice_id: string; text: string } | null
}
export interface LiveAnswer { turn_index: number; answer_text: string; client_submission_id: string }

const liveMessages: Record<number, string> = {
  401: 'Sesi masuk berakhir. Silakan masuk kembali.',
  404: 'Sesi tidak tersedia untuk akun ini.',
  409: 'Sesi sudah berubah. Periksa pembaruan sebelum mencoba lagi.',
  422: 'Periksa kembali isianmu.',
  429: 'Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi.',
}

export class LiveError extends ApiError {
  constructor(status: number, code: string, requestId?: string) {
    super(status, code, requestId, liveMessages[status] ?? 'Pembaruan belum berhasil. Periksa koneksi dan coba lagi.')
    this.name = 'LiveError'
  }
}
