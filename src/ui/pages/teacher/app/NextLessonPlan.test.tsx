import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import type { ClassMap, ClassMapMisconception, TeachingPlan } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { NextLessonPlan } from './NextLessonPlan'

const plan: TeachingPlan = {
  objective: 'Siswa menjelaskan gaya gesek.', counter_example: 'Kelereng di karpet berhenti lebih cepat.',
  steps: [
    { phase: 'elicit', teacher_action: 'Tunjukkan kelereng.', ask: 'Mengapa berhenti?' },
    { phase: 'contrast', teacher_action: 'Gulirkan di karpet.', ask: 'Apa bedanya?' },
    { phase: 'explain', teacher_action: 'Sebut gagasan keliru.', ask: 'Jelaskan lagi.' },
  ],
  check_question: 'Mengapa sepeda berhenti?', look_for: 'Menyebut gesekan.',
}
const misconception = (teaching_plan: TeachingPlan | null): ClassMapMisconception => ({
  misconception_id: 'm1', statement: 'Gaya dorong habis', count: 2, resolved_count: 0, student_ids: ['a', 'b'],
  students: [{ student_id: 'a', name: 'Ani', session_id: 's-a' }, { student_id: 'b', name: 'Budi', session_id: 's-b' }],
  correct_understanding: 'Gesekan melawan gerak.', counter_examples: ['Kelereng di karpet berhenti lebih cepat.'], detection_cues: [], source: 'kb', citations: [], teaching_plan,
})
const map = (teaching_plan: TeachingPlan | null): ClassMap => ({
  denominator: 10, incomplete_count: 0, prerequisites: [], insight: null,
  concepts: [{ concept_id: 'c1', name: 'Gaya gesek', mastered_count: 8, developing_count: 0, not_observed_count: 0, misconceptions: [misconception(teaching_plan)] }],
})
const show = (data: ClassMap, service: Partial<TeacherService>) => render(<MemoryRouter><NextLessonPlan data={data} trail={null} publicationId="p1" base="/guru" offline={false} service={service as TeacherService} refresh={() => undefined} openStrategy={() => undefined} /></MemoryRouter>)

describe('NextLessonPlan', () => {
  it('leads with reviewed material, keeps names folded and asks Nala once', async () => {
    const requestTeachingPlan = vi.fn().mockResolvedValue({ job_id: 'j1' })
    show(map(null), { requestTeachingPlan, jobStatus: vi.fn().mockResolvedValue({ status: 'running', error_code: null }) })
    expect(screen.getByText('2 dari 10 siswa masih memegang gagasan ini. Saran: ajak kelompok kecil ini berdiskusi sementara siswa lain berlatih.')).toBeInTheDocument()
    expect(screen.getByText('Ani')).not.toBeVisible()
    await userEvent.click(screen.getByRole('button', { name: 'Susun kegiatan dengan Nala' }))
    expect(requestTeachingPlan).toHaveBeenCalledWith('p1', 'm1')
    expect(await screen.findByText('Nala sedang menyusun kegiatan dari bahan ini…')).toBeInTheDocument()
  })

  it('shows the stored plan as steps with the reviewed example and the check', () => {
    show(map(plan), {})
    expect(screen.getByText('2. Hadapkan dengan contoh')).toBeInTheDocument()
    expect(screen.getByText('Contoh yang sudah ditinjau: Kelereng di karpet berhenti lebih cepat.')).toBeInTheDocument()
    expect(screen.getByText('Dengarkan: Menyebut gesekan.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Susun kegiatan dengan Nala' })).toBeNull()
  })
})
