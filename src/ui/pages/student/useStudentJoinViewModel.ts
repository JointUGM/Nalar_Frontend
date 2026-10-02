import { useState } from 'react'
import { joinExample } from './studentExamples'

export type JoinResult = 'incomplete' | 'match' | 'unknown'
export const codeLength = 6

/** Pasted text may carry spaces, dashes or lower case, so keep only letters and digits and cut to the code length. */
export function normalizeCode(raw: string): string {
  return raw.toLocaleUpperCase('en-US').replace(/[^A-Z0-9]/g, '').slice(0, codeLength)
}

/** Review-only lookup: only the example code (the one on the teacher's projector) matches. */
export function checkJoinCode(code: string): JoinResult {
  if (code.length < codeLength) return 'incomplete'
  return code === joinExample.code ? 'match' : 'unknown'
}

export function useStudentJoinViewModel() {
  const [code, setCode] = useState('')
  const [wrong, setWrong] = useState(false)
  const [joined, setJoined] = useState(false)
  const join = () => { setWrong(false); setJoined(true) }
  return {
    code, wrong, joined,
    chars: Array.from({ length: codeLength }, (_, index) => code[index] ?? ''),
    /** A full code is checked as soon as it is typed, like the supplied screen. */
    type: (raw: string) => {
      if (joined) return
      const next = normalizeCode(raw)
      setCode(next)
      setWrong(false)
      const result = checkJoinCode(next)
      if (result === 'match') join()
      else if (result === 'unknown') setWrong(true)
    },
    submit: () => {
      if (joined) return
      if (checkJoinCode(code) === 'match') join()
      else setWrong(true)
    },
    fillDemo: () => { if (joined) return; setCode(joinExample.code); join() },
  }
}
