import type { AccountActivation } from '@/domain/model/AccountActivation'
import { OperationError } from '@/domain/model/OperationError'
import type { AuthService } from '@/domain/services/AuthService'

export class ActivateAccountUseCase {
  constructor(private readonly auth: AuthService) {}

  async execute(activation: AccountActivation): Promise<void> {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(activation.activationId) || !activation.tokenHash || activation.tokenHash.length > 256) throw new OperationError('invalid_activation')
    if ([...activation.password].length < 8 || activation.password.length > 256) throw new OperationError('weak_password')
    await this.auth.activateAccount(activation)
  }
}
