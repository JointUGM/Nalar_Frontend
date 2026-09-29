import { describe, expect, it } from 'vitest'
import { AddLogUseCase } from '@/application/add-log-use-case'
import type { Log } from '@/domain/model/Log'
import type { LoggerService } from '@/domain/services/LoggerService'

describe('AddLogUseCase', () => {
  it('saves a trimmed message and returns the saved log', async () => {
    const saved: Log[] = []
    const logger: LoggerService = { save: async (log) => { saved.push(log) } }
    const result = await new AddLogUseCase(logger).execute('  First message  ')

    expect(result.message).toBe('First message')
    expect(saved).toEqual([result])
    expect(result.when).toBeTypeOf('number')
  })

  it('rejects a blank message without storing anything', async () => {
    const saved: Log[] = []
    const logger: LoggerService = { save: async (log) => { saved.push(log) } }

    await expect(new AddLogUseCase(logger).execute('   ')).rejects.toThrow('Enter a message.')
    expect(saved).toEqual([])
  })

  it('propagates a storage failure to the caller', async () => {
    const logger: LoggerService = { save: async () => { throw new Error('Storage unavailable') } }

    await expect(new AddLogUseCase(logger).execute('Message')).rejects.toThrow('Storage unavailable')
  })
})
