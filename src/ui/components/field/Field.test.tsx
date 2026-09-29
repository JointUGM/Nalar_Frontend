import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Field } from './Field'

describe('Field', () => {
  it('associates its label, help and error without losing an external description', () => {
    const { rerender } = render(<>
      <p id="privacy">Hanya untuk administrasi.</p>
      <Field label="Email admin" help="Gunakan email aktif." error="Periksa alamat email." aria-describedby="privacy" defaultValue="belum-valid" />
    </>)
    const input = screen.getByRole('textbox', { name: 'Email admin' })
    expect(input).toHaveAccessibleDescription('Hanya untuk administrasi. Gunakan email aktif. Periksa alamat email.')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveValue('belum-valid')

    rerender(<>
      <p id="privacy">Hanya untuk administrasi.</p>
      <Field label="Email admin" help="Gunakan email aktif." aria-describedby="privacy" defaultValue="belum-valid" />
    </>)
    expect(input).toHaveAccessibleDescription('Hanya untuk administrasi. Gunakan email aktif.')
    expect(input).not.toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveValue('belum-valid')
  })

  it('keeps independent fields associated with their own labels and errors', () => {
    render(<>
      <Field label="Nama sekolah" error="Isi nama sekolah." />
      <Field label="NPSN" id="npsn" error="Masukkan delapan digit." />
    </>)
    const name = screen.getByRole('textbox', { name: 'Nama sekolah' })
    const npsn = screen.getByRole('textbox', { name: 'NPSN' })
    expect(name.id).not.toBe(npsn.id)
    expect(name).toHaveAccessibleDescription('Isi nama sekolah.')
    expect(npsn).toHaveAccessibleDescription('Masukkan delapan digit.')
    expect(npsn.id).toBe('npsn')
  })
})
