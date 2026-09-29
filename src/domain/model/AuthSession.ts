// Local session metadata only; backend /me determines capabilities and roles.
export interface AuthSession {
  readonly userId: string
  readonly expiresAt: number // Unix seconds
}

export interface SignInCredentials {
  readonly email: string
  readonly password: string
}
