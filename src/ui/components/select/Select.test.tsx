import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { Select } from './Select'

const options = [{ value: 'ipa', label: 'IPA' }, { value: 'ips', label: 'IPS', description: 'Kelas 8' }]

function Example() {
  const [value, setValue] = useState('')
  return <Select label="Mata pelajaran" value={value} options={options} onChange={setValue} hint="Pilih satu." />
}

describe('Select', () => {
  it('is a labelled combobox that shows the placeholder, then the chosen option', async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole('combobox', { name: 'Mata pelajaran' })
    expect(trigger).toHaveTextContent('Pilih salah satu')
    expect(trigger).toHaveAccessibleDescription('Pilih satu.')
    await user.click(trigger)
    await user.click(await screen.findByRole('option', { name: /IPS/ }))
    expect(trigger).toHaveTextContent('IPS')
    expect(trigger).toHaveTextContent('Kelas 8')
  })
})
