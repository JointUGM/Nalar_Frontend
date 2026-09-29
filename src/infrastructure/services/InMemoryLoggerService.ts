import type { Log } from '@/domain/model/Log'
import type { LoggerService } from '@/domain/services/LoggerService'

export class InMemoryLoggerService implements LoggerService {
  readonly logs: Log[] = []

  async save(log: Log): Promise<void> {
    this.logs.push(log)
  }
}
