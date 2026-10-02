import { useState } from 'react'
import { checkPassword, passwordAccepted } from './passwordRules'
import { useAccountPreview } from './useAccountPreview'

export type ActivateMode = 'link' | 'slip'

export function useAccountActivateViewModel() {
  const preview = useAccountPreview()
  const [mode, setMode] = useState<ActivateMode>('link')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [repeat, setRepeat] = useState('')
  const [tried, setTried] = useState(false)
  const rules = checkPassword(password)
  const fields = {
    code: tried && mode === 'slip' && !code.trim() ? 'Masukkan kode dari slip.' : undefined,
    password: tried && !passwordAccepted(rules) ? 'Kata sandi belum memenuhi syarat.' : undefined,
    repeat: tried && repeat !== password ? 'Kata sandi tidak sama.' : undefined,
  }
  const valid = (mode === 'link' || code.trim().length > 0) && passwordAccepted(rules) && repeat === password

  function submit() {
    setTried(true)
    if (!valid) return
    // Done: the typed password is dropped; the preview never keeps one.
    preview.start()
  }
  return {
    preview, mode, setMode, code, setCode, password, setPassword, repeat, setRepeat, rules, fields, submit,
    done: preview.status === 'done',
    again: () => { setPassword(''); setRepeat(''); setCode(''); setTried(false); preview.reset() },
  }
}
