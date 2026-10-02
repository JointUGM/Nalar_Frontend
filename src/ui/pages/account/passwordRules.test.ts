import { describe, expect, it } from 'vitest'
import { checkPassword, passwordAccepted } from './passwordRules'

describe('password rules', () => {
  it('needs eight characters and a digit', () => {
    expect(checkPassword('')).toEqual({ length: false, digit: false })
    expect(checkPassword('kelerengku')).toEqual({ length: true, digit: false })
    expect(checkPassword('es24')).toEqual({ length: false, digit: true })
    expect(passwordAccepted(checkPassword('kelereng24'))).toBe(true)
    expect(passwordAccepted(checkPassword('kelereng'))).toBe(false)
  })
})
