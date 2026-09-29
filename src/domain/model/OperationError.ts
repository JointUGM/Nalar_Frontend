export type OperationErrorCode = 'unauthenticated' | 'forbidden' | 'not_found' | 'rate_limited' | 'unavailable' | 'invalid_response'

const messages: Record<OperationErrorCode, string> = {
  unauthenticated: 'Silakan masuk terlebih dahulu.',
  forbidden: 'Akses tidak tersedia untuk akun ini.',
  not_found: 'Data tidak tersedia.',
  rate_limited: 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.',
  unavailable: 'Layanan sedang tidak tersedia. Coba lagi sebentar.',
  invalid_response: 'Data akun belum dapat dibaca. Coba lagi sebentar.',
}

export class OperationError extends Error {
  readonly code: OperationErrorCode
  readonly status?: number
  readonly requestId?: string

  constructor(code: OperationErrorCode, metadata: { status?: number; requestId?: string } = {}) {
    super(messages[code])
    this.name = 'OperationError'
    this.code = code
    this.status = metadata.status
    this.requestId = metadata.requestId
  }
}
