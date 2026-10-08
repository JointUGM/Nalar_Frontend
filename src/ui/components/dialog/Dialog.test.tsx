import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StrictMode, useState } from 'react'
import { describe, expect, it } from 'vitest'
import { Dialog } from './Dialog'

function Example({ dismissible = true }: { dismissible?: boolean }) {
  const [open, setOpen] = useState(false)
  return <>
    <button onClick={() => setOpen(true)}>Tinjau sekolah</button>
    <Dialog open={open} onClose={() => setOpen(false)} title="Tinjau isian" description="Periksa data sebelum melanjutkan." dismissible={dismissible}>
      <button onClick={() => setOpen(false)}>Kembali ke formulir</button>
    </Dialog>
  </>
}

describe('Dialog', () => {
  // Base UI wraps focus through guard elements that jsdom does not redirect, so this checks the page behind never gets it.
  it('keeps keyboard focus away from the page behind', async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole('button', { name: 'Tinjau sekolah' })
    await user.click(trigger)
    await screen.findByRole('dialog', { name: 'Tinjau isian' })
    for (let step = 0; step < 4; step++) {
      await user.tab({ shift: step % 2 === 1 })
      expect(trigger).not.toHaveFocus()
      expect(document.activeElement).not.toBe(document.body)
    }
  })

  it('exposes its title and description and returns focus after closing', async () => {
    const user = userEvent.setup()
    render(<StrictMode><Example /></StrictMode>)
    const trigger = screen.getByRole('button', { name: 'Tinjau sekolah' })
    await user.click(trigger)
    const dialog = await screen.findByRole('dialog', { name: 'Tinjau isian' })
    expect(dialog).toHaveAccessibleDescription('Periksa data sebelum melanjutkan.')
    await user.click(screen.getByRole('button', { name: 'Tutup dialog' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())

    await user.click(trigger)
    await user.click(await screen.findByRole('button', { name: 'Kembali ke formulir' }))
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('closes on Escape and can open again', async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole('button', { name: 'Tinjau sekolah' })
    await user.click(trigger)
    await screen.findByRole('dialog')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await user.click(trigger)
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })

  it('stays open on Escape when the workflow temporarily forbids dismissal', async () => {
    const user = userEvent.setup()
    render(<Example dismissible={false} />)
    await user.click(screen.getByRole('button', { name: 'Tinjau sekolah' }))
    const dialog = await screen.findByRole('dialog')
    await user.keyboard('{Escape}')
    expect(dialog).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tutup dialog' })).toBeDisabled()
  })
})
