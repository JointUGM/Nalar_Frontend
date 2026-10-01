import { useCallback, useState } from 'react'
import { copyClassCount, nextYear } from './yearExamples'

export function useSchoolYearViewModel() {
  const [copied, setCopied] = useState(false)
  const [copying, setCopying] = useState(false)
  const [message, setMessage] = useState('')
  const applyCopy = useCallback(() => {
    setCopied(true)
    setMessage(`${copyClassCount} kelas ${nextYear} disalin dalam simulasi lokal. Data sekolah tidak berubah; muat ulang akan mengembalikan data contoh.`)
  }, [])
  return { copied, copying, setCopying, message, applyCopy }
}
