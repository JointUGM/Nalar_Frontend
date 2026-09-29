import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('does not submit a surrounding form unless explicitly configured', async () => {
    const user = userEvent.setup()
    let submissions = 0
    render(
      <form onSubmit={(event) => { event.preventDefault(); submissions++ }}>
        <Button>Tinjau</Button>
        <Button type="submit">Simpan</Button>
      </form>,
    )

    await user.click(screen.getByRole('button', { name: 'Tinjau' }))
    expect(submissions).toBe(0)
    await user.click(screen.getByRole('button', { name: 'Simpan' }))
    expect(submissions).toBe(1)
  })

  it('blocks repeat activation while pending and resumes when pending clears', async () => {
    const user = userEvent.setup()
    function Example({ pending }: { pending: boolean }) {
      const [count, setCount] = useState(0)
      return <Button pending={pending} pendingLabel="Menyimpan…" onClick={() => setCount(count + 1)}>Simpan {count}</Button>
    }
    const { rerender } = render(<Example pending />)
    const pending = screen.getByRole('button', { name: 'Menyimpan…' })
    expect(pending).toBeDisabled()
    expect(pending).toHaveAttribute('aria-busy', 'true')
    await user.click(pending)

    rerender(<Example pending={false} />)
    const ready = screen.getByRole('button', { name: 'Simpan 0' })
    expect(ready).toBeEnabled()
    await user.click(ready)
    expect(screen.getByRole('button', { name: 'Simpan 1' })).toBeInTheDocument()
  })
})
