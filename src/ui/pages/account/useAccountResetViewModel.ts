import { useState } from 'react'
import { useAccountPreview } from './useAccountPreview'

const looksLikeEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value.trim())

export function useAccountResetViewModel() {
  const preview = useAccountPreview()
  const [email, setEmail] = useState('')
  const [tried, setTried] = useState(false)
  const error = tried && !looksLikeEmail(email) ? 'Masukkan email akun Anda, misalnya nama@sekolah.sch.id.' : undefined
  return {
    preview, email, setEmail, error,
    sent: preview.status === 'done',
    submit: () => { setTried(true); if (looksLikeEmail(email)) preview.start() },
    again: () => preview.reset(),
  }
}
