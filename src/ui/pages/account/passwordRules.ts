export interface PasswordRules { length: boolean; digit: boolean }

export const minPasswordLength = 8

export function checkPassword(value: string): PasswordRules {
  return { length: value.length >= minPasswordLength, digit: /\d/.test(value) }
}

export const passwordAccepted = (rules: PasswordRules) => rules.length && rules.digit
