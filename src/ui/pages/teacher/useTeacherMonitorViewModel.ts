import { useEffect, useState } from 'react'
import { monitorExample, studentNames } from './teacherSessionExamples'
import { useSessionTarget } from './useSessionTarget'

export type RosterStatus = 'paused' | 'not-started' | 'running' | 'done'
export type RosterFilter = 'all' | 'not-started' | 'running' | 'done' | 'flagged'
export type Connection = 'ok' | 'stale' | 'offline'
export type RosterSort = 'status' | 'name'
export interface RosterEntry { index: number; name: string; status: RosterStatus; flagged: boolean; step: number; label: string }

const { steps, refreshSeconds, pausedIndex, notStartedIndex, flaggedIndexes } = monitorExample
const questionCount = steps - 1

/** Scripted progress: each student starts at a fixed step and moves one step on their own cadence per refresh. */
export function buildRoster(dataTick: number, alertOpen: boolean): RosterEntry[] {
  return studentNames.map((name, index) => {
    let advances = 0
    for (let tick = 1; tick <= dataTick; tick++) if (tick % 5 === index % 5) advances++
    const step = index === notStartedIndex ? 0 : Math.min(steps, (index * 5) % 7 + advances)
    const flagged = flaggedIndexes.includes(index)
    const status: RosterStatus = index === pausedIndex && alertOpen ? 'paused' : index === notStartedIndex ? 'not-started' : step >= steps ? 'done' : 'running'
    const progress = step === 0 ? 'Soal pembuka' : `Pertanyaan ${step} dari ${questionCount}`
    const label = status === 'paused' ? 'Dijeda · perlu Anda' : status === 'not-started' ? 'Belum mulai'
      : flagged ? `Perlu verifikasi · ${status === 'done' ? 'selesai' : progress.toLowerCase()}` : status === 'done' ? 'Selesai' : progress
    return { index, name, status, flagged, step: status === 'paused' ? Math.min(step, 2) : step, label }
  })
}

export function formatElapsed(secs: number): string {
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`
}

export function tallyRoster(roster: readonly RosterEntry[]) {
  const count = (test: (entry: RosterEntry) => boolean) => roster.filter(test).length
  return {
    'not-started': count((entry) => entry.status === 'not-started'),
    running: count((entry) => entry.status === 'running' || entry.status === 'paused'),
    done: count((entry) => entry.status === 'done'),
    flagged: count((entry) => entry.flagged),
  }
}

const matches: Record<RosterFilter, (entry: RosterEntry) => boolean> = {
  all: () => true,
  'not-started': (entry) => entry.status === 'not-started',
  running: (entry) => entry.status === 'running' || entry.status === 'paused',
  done: (entry) => entry.status === 'done',
  flagged: (entry) => entry.flagged,
}
// Students who need the teacher first, then verification notes, then in-progress, waiting and finished.
const rank = (entry: RosterEntry) => entry.status === 'paused' ? 0 : entry.flagged && entry.status !== 'done' ? 1 : entry.status === 'running' ? 2 : entry.status === 'not-started' ? 3 : 4

export function arrangeRoster(roster: readonly RosterEntry[], filter: RosterFilter, sort: RosterSort): RosterEntry[] {
  const visible = roster.filter(matches[filter])
  return sort === 'name' ? visible.sort((a, b) => a.name.localeCompare(b.name, 'id')) : visible.sort((a, b) => rank(a) - rank(b) || a.step - b.step || a.index - b.index)
}

export function useTeacherMonitorViewModel() {
  const { mission, klass } = useSessionTarget()
  const [clock, setClock] = useState({ secs: monitorExample.startSeconds, dataTick: 0, age: 0 })
  const [connection, setConnection] = useState<Connection>('ok')
  const [alertOpen, setAlertOpen] = useState(true)
  const [filter, setFilter] = useState<RosterFilter>('all')
  const [sort, setSort] = useState<RosterSort>('status')
  const [selected, setSelected] = useState<number | null>(null)
  const [closed, setClosed] = useState(false)

  // One second per tick. Data refreshes every few seconds only while connected; otherwise it ages (the stale state).
  useEffect(() => {
    const timer = setInterval(() => setClock((current) => {
      const secs = current.secs + 1
      if (connection !== 'ok') return { ...current, secs, age: current.age + 1 }
      return current.age + 1 >= refreshSeconds ? { secs, dataTick: current.dataTick + 1, age: 0 } : { ...current, secs, age: current.age + 1 }
    }), 1000)
    return () => clearInterval(timer)
  }, [connection])

  const roster = buildRoster(clock.dataTick, alertOpen)
  return {
    mission, klass, connection, closed, alertOpen, filter, sort,
    elapsed: formatElapsed(clock.secs), age: clock.age, roster,
    tally: tallyRoster(roster), visible: arrangeRoster(roster, filter, sort),
    selected: selected === null ? null : roster[selected] ?? null,
    setConnection,
    ackAlert: () => setAlertOpen(false),
    toggleFilter: (next: RosterFilter) => setFilter((current) => current === next ? 'all' : next),
    toggleSort: () => setSort((current) => current === 'status' ? 'name' : 'status'),
    select: (index: number) => setSelected((current) => current === index ? null : index),
    // Closing admission is a state change, so it is refused while the connection is down.
    closeAdmission: () => { if (connection !== 'offline') setClosed(true) },
  }
}
