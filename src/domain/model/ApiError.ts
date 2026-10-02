const messages: Record<number, string> = {
  400: 'Periksa kembali isian Anda.',
  401: 'Sesi masuk berakhir. Silakan masuk kembali.',
  403: 'Data ini tidak tersedia untuk akun Anda.',
  404: 'Data ini tidak tersedia untuk akun Anda.',
  409: 'Data sudah berubah. Muat ulang lalu coba lagi.',
  422: 'Periksa kembali isian Anda.',
  429: 'Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi.',
  503: 'Layanan sedang sibuk. Coba lagi sebentar.',
}

// The message is chosen here from the status; the backend's own text never reaches the screen.
export class ApiError extends Error {
  constructor(readonly status: number, readonly code: string, readonly requestId?: string, message?: string) {
    super(message ?? messages[status] ?? 'Permintaan belum berhasil. Periksa koneksi dan coba lagi.')
    this.name = 'ApiError'
  }
}

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** An id that is not a UUID can never be in scope, so it is answered like any hidden resource, without a request. */
export function resourceId(value: string): string {
  if (!uuid.test(value)) throw new ApiError(404, 'NOT_FOUND')
  return value
}
