import type { Log } from '@/domain/model/Log'

export interface LoggerService {
  save(log: Log): Promise<void>
}
