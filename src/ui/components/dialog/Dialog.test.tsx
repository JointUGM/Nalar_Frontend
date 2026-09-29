import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StrictMode, useState } from 'react'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { Dialog } from './Dialog'

const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close')

beforeAll(() => {
  // jsdom lacks the native modal API; focus containment is verified in a browser.
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: { configurable: true, value(this: HTMLDialogElement) { this.open = true } },
    close: { configurable: true, value(this: HTMLDialogElement) { this.open = false } },
  })
})

afterAll(() => {
  if (originalShowModal) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', originalShowModal)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
  if (originalClose) Object.defineProperty(HTMLDialogElement.prototype, 'close', originalClose)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'close')
})

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
  it('wraps keyboard focus at both ends of the dialog', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole('button', { name: 'Tinjau sekolah' }))
    const first = screen.getByRole('button', { name: 'Tutup dialog' })
    const last = screen.getByRole('button', { name: 'Kembali ke formulir' })
    first.focus()
    await user.tab({ shift: true })
    expect(last).toHaveFocus()
    await user.tab()
    expect(first).toHaveFocus()
  })

  it('exposes its title and description and returns focus after closing', async () => {
    const user = userEvent.setup()
    render(<StrictMode><Example /></StrictMode>)
    const trigger = screen.getByRole('button', { name: 'Tinjau sekolah' })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Tinjau isian' })
    expect(dialog).toHaveAccessibleDescription('Periksa data sebelum melanjutkan.')
    await user.click(screen.getByRole('button', { name: 'Tutup dialog' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()

    await user.click(trigger)
    await user.click(screen.getByRole('button', { name: 'Kembali ke formulir' }))
    expect(trigger).toHaveFocus()
  })

  it('synchronizes a native Escape cancellation with its controlled open state', async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole('button', { name: 'Tinjau sekolah' })
    await user.click(trigger)
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
    await user.click(trigger)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('keeps the dialog open when the workflow temporarily forbids dismissal', async () => {
    const user = userEvent.setup()
    render(<Example dismissible={false} />)
    await user.click(screen.getByRole('button', { name: 'Tinjau sekolah' }))
    const dialog = screen.getByRole('dialog')
    const cancel = new Event('cancel', { cancelable: true })
    fireEvent(dialog, cancel)
    expect(cancel.defaultPrevented).toBe(true)
    expect(dialog).toBeVisible()
    expect(screen.getByRole('button', { name: 'Tutup dialog' })).toBeDisabled()
  })
})
