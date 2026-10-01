import { useState } from 'react'
import { joinExample } from './studentExamples'

export type JoinScenario = 'unknown' | 'closed' | 'limited'
export type JoinResult = 'incomplete' | 'match' | JoinScenario
export const codeLength = 6

/** Pasted text may carry spaces, dashes or lower case, so keep only letters and digits and cut to the code length. */
export function normalizeCode(raw: string): string {
  return raw.toLocaleUpperCase('en-US').replace(/[^A-Z0-9]/g, '').slice(0, codeLength)
}

/** Review-only lookup: the example code matches, every other code resolves by the chosen scenario, and a rate limit blocks them all. */
export function checkJoinCode(code: string, scenario: JoinScenario): JoinResult {
  if (code.length < codeLength) return 'incomplete'
  if (scenario === 'limited') return 'limited'
  return code === joinExample.code ? 'match' : scenario
}

export function useStudentJoinViewModel() {
  const [code, setCode] = useState('')
  const [scenario, setScenario] = useState<JoinScenario>('unknown')
  return {
    code, scenario, setScenario,
    setCode: (raw: string) => setCode(normalizeCode(raw)),
    result: checkJoinCode(code, scenario),
    chars: Array.from({ length: codeLength }, (_, index) => code[index] ?? ''),
  }
}
