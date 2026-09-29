import { AddLogUseCase } from '@/application/add-log-use-case'
import { InMemoryLoggerService } from '@/infrastructure/services/InMemoryLoggerService'

export function createDependencies() {
  const logger = new InMemoryLoggerService()
  return { addLog: new AddLogUseCase(logger) }
}
