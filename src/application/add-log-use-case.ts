import { Log } from '@/domain/model/Log'
import type { LoggerService } from '@/domain/services/LoggerService'

export class AddLogUseCase {
  private readonly logger: LoggerService

  constructor(logger: LoggerService) {
    this.logger = logger
  }

  async execute(message: string): Promise<Log> {
    const log = new Log(message)
    await this.logger.save(log)
    return log
  }
}
