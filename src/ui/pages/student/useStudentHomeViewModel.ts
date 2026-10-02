import { useState } from 'react'
import { formatToday, missionRows, openMissions, shifts, studentKpis, studentUser } from './studentExamples'

export type HomeScenario = 'normal' | 'loading' | 'empty'
export type MissionTab = 'upcoming' | 'done'

export const missionTabs: readonly (readonly [MissionTab, string])[] = [['upcoming', 'Akan datang'], ['done', 'Selesai']]

export function useStudentHomeViewModel() {
  const [scenario, setScenario] = useState<HomeScenario>('normal')
  const [tab, setTab] = useState<MissionTab>('upcoming')
  const empty = scenario === 'empty'
  return {
    scenario, setScenario, tab, setTab,
    firstName: studentUser.split(' ')[0], today: formatToday(),
    open: empty ? [] : openMissions, rows: empty ? [] : missionRows[tab], shifts: empty ? [] : shifts, kpis: empty ? [] : studentKpis,
    startable: empty ? 0 : openMissions.filter((mission) => mission.kind === 'start').length,
  }
}
