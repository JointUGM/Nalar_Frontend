import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AddLogUseCase } from '@/application/add-log-use-case'
import { InMemoryLoggerService } from '@/infrastructure/services/InMemoryLoggerService'
import { Home } from '@/ui/pages/home/Home'

describe('Home', () => {
  it('submits a message through the use case and displays the saved log', async () => {
    const user = userEvent.setup()
    const logger = new InMemoryLoggerService()
    render(<Home addLog={new AddLogUseCase(logger)} />)

    await user.type(screen.getByRole('textbox', { name: 'Message' }), 'Hello Nalar')
    await user.click(screen.getByRole('button', { name: 'Add message' }))

    expect(await screen.findByText('Hello Nalar')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('')
    expect(logger.logs.map((log) => log.message)).toEqual(['Hello Nalar'])
  })

  it('shows validation errors and keeps the input for correction', async () => {
    const user = userEvent.setup()
    render(<Home addLog={new AddLogUseCase(new InMemoryLoggerService())} />)

    await user.type(screen.getByRole('textbox', { name: 'Message' }), '   ')
    await user.click(screen.getByRole('button', { name: 'Add message' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Enter a message.')
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('   ')
  })

  it('shows a storage error without adding a successful entry', async () => {
    const user = userEvent.setup()
    const addLog = new AddLogUseCase({ save: async () => { throw new Error('Storage unavailable') } })
    render(<Home addLog={addLog} />)

    await user.type(screen.getByRole('textbox', { name: 'Message' }), 'Keep this message')
    await user.click(screen.getByRole('button', { name: 'Add message' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Storage unavailable')
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('Keep this message')
    expect(screen.getByText('No messages yet.')).toBeInTheDocument()
  })
})
