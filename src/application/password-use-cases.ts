import type { AccountActivation } from '@/domain/model/AccountActivation'
import { OperationError } from '@/domain/model/OperationError'
import type { AuthService } from '@/domain/services/AuthService'

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const strong = (password: string) => [...password].length >= 8 && password.length <= 256

// Asks for a reset link. The answer is the same whether or not the address has an account.
export class RequestPasswordResetUseCase {
  constructor(private readonly auth: AuthService) {}
  async execute(email: string): Promise<void> {
    const address = email.trim().toLowerCase()
    if (address.length < 3 || address.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) throw new OperationError('invalid_credentials')
    await this.auth.requestPasswordReset(address)
  }
  enabled(): Promise<boolean> { return this.auth.passwordResetEnabled() }
}

// Sets a new password from the emailed reset link (the link's reset id travels as `activationId`).
export class ResetPasswordUseCase {
  constructor(private readonly auth: AuthService) {}
  async execute(reset: AccountActivation): Promise<void> {
    if (!uuid.test(reset.activationId) || !reset.tokenHash || reset.tokenHash.length > 256) throw new OperationError('invalid_activation')
    if (!strong(reset.password)) throw new OperationError('weak_password')
    await this.auth.resetPassword(reset)
  }
}

// Changes the password of the signed-in account; the backend then ends every session of that account.
export class ChangePasswordUseCase {
  constructor(private readonly auth: AuthService) {}
  async execute(current: string, next: string): Promise<void> {
    if (!current || current.length > 256) throw new OperationError('invalid_credentials')
    if (!strong(next)) throw new OperationError('weak_password')
    await this.auth.changePassword(current, next)
  }
}
