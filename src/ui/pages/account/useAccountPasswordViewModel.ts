import { useState } from 'react'
import { checkPassword, passwordAccepted } from './passwordRules'
import { useAccountPreview } from './useAccountPreview'

export function useAccountPasswordViewModel() {
  const preview = useAccountPreview()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [repeat, setRepeat] = useState('')
  const [tried, setTried] = useState(false)
  const fields = {
    current: tried && !current ? 'Masukkan kata sandi Anda saat ini.' : undefined,
    next: tried && !passwordAccepted(checkPassword(next)) ? 'Minimal 8 karakter dan ada angka.' : undefined,
    repeat: tried && repeat !== next ? 'Kata sandi tidak sama.' : undefined,
  }
  return {
    preview, current, setCurrent, next, setNext, repeat, setRepeat, fields,
    done: preview.status === 'done',
    submit: () => { setTried(true); if (current && passwordAccepted(checkPassword(next)) && repeat === next) preview.start() },
    again: () => { setCurrent(''); setNext(''); setRepeat(''); setTried(false); preview.reset() },
  }
}
