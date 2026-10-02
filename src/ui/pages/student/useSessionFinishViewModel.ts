import { useEffect, useState } from 'react'

export const reflectionTickMs = 150
const tickPercent = 5

/** The reflection is "written" after a short wait. It is a local timer, not a real generation. */
export function useSessionFinishViewModel() {
  const [percent, setPercent] = useState(0)
  useEffect(() => {
    if (percent >= 100) return
    const timer = setTimeout(() => setPercent((value) => Math.min(100, value + tickPercent)), reflectionTickMs)
    return () => clearTimeout(timer)
  }, [percent])
  return { percent, ready: percent >= 100 }
}
