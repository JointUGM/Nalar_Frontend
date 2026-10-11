import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DatePicker } from './DatePicker'

describe('DatePicker', () => {
  it('renders label and initial date formatted in Indonesian', () => {
    const onChange = vi.fn()
    render(<DatePicker label="Tanggal mulai" value="2026-11-19" onChange={onChange} />)

    expect(screen.getByText('Tanggal mulai')).toBeInTheDocument()
    expect(screen.getByText('19 November 2026')).toBeInTheDocument()
  })

  it('allows selecting year and month directly from the calendar header', () => {
    const onChange = vi.fn()
    render(<DatePicker label="Tanggal selesai" value="2026-11-19" onChange={onChange} />)

    // Open the calendar popover
    fireEvent.click(screen.getByRole('button', { name: /19 November 2026/i }))

    // Month and Year selects exist in the popover header
    const monthSelect = screen.getByRole('combobox', { name: 'Pilih bulan' })
    const yearSelect = screen.getByRole('combobox', { name: 'Pilih tahun' })

    expect(monthSelect).toHaveValue('10') // November (0-indexed)
    expect(yearSelect).toHaveValue('2026')

    // Change year to 2027 and month to Juli (6)
    fireEvent.change(yearSelect, { target: { value: '2027' } })
    fireEvent.change(monthSelect, { target: { value: '6' } })

    expect(yearSelect).toHaveValue('2027')
    expect(monthSelect).toHaveValue('6')

    // Click day 15
    const day15 = screen.getByRole('button', { name: '15 Juli 2027' })
    fireEvent.click(day15)

    expect(onChange).toHaveBeenCalledWith('2027-07-15')
  })

  it('clears date when Hapus is clicked', () => {
    const onChange = vi.fn()
    render(<DatePicker label="Tanggal mulai" value="2026-11-19" onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: /19 November 2026/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Hapus' }))

    expect(onChange).toHaveBeenCalledWith('')
  })
})
