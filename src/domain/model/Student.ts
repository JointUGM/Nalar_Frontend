// What a student may see about a mission: name, subject, time, mode and their own attempt status. Never a rubric, score or answer state.
export interface MissionCard {
  publication_id: string
  mission_title: string
  subject_name: string
  mode: string
  run_status: string
  attempt_status: string
  // The student's latest session for this mission, if any: a finished one reopens its reflection.
  session_id: string | null
  // A teacher-granted retake is its own card with its own run; start it with that run id.
  run_id: string
  attempt_number: number
  is_granted_attempt: boolean
  opens_at: string | null
  closes_at: string | null
  target_duration_minutes: number
  max_duration_minutes: number
}
export interface StudentMissions { open: MissionCard[]; upcoming: MissionCard[]; completed: MissionCard[] }
export interface WindowSession { session_id: string }

// Authenticity telemetry holds counts and timings only (NFR-S11): never what was typed or pasted.
export type TelemetryEvent =
  | { type: 'paste' | 'visibility_hidden'; at: string; value: number }
  | { type: 'disconnect' | 'reconnect'; at: string }
  | { type: 'typing'; at: string; value: { chars: number; duration_ms: number } }
export interface TelemetryBatch { client_seq: number; turn_index: number | null; events: TelemetryEvent[] }

// A finished mission's reflection, written for the student; it never carries a score.
export interface StudentReflection { session_id: string; mission_title: string; completed_at: string; content: string }
