import type { Identity } from '@/domain/model/Identity'

export interface IdentityRepository {
  getMe(): Promise<Identity>
}
