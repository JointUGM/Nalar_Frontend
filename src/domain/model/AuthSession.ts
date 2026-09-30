// Local session metadata only; backend /me determines capabilities and roles.
export interface AuthSession {
  readonly userId: string
  readonly expiresAt: number // Unix seconds
}

export interface SignInCredentials {
  readonly email: string
  readonly password: string
}

export class CredentialValidationError extends Error {
  constructor(readonly fields: Partial<Record<keyof SignInCredentials, string>>) {
    super('Periksa email dan kata sandi.')
    this.name = 'CredentialValidationError'
  }
}

export function validateSignInCredentials(credentials: SignInCredentials): SignInCredentials {
  const email = credentials.email.trim()
  const fields: CredentialValidationError['fields'] = {}
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fields.email = 'Masukkan alamat email yang valid.'
  if (!credentials.password.length) fields.password = 'Masukkan kata sandi Anda.'
  if (Object.keys(fields).length) throw new CredentialValidationError(fields)
  return { email, password: credentials.password }
}
