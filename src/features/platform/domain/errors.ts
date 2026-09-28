export class PlatformError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = "PlatformError";
  }
}
export function errorMessage(error: unknown): string {
  if (error instanceof PlatformError) return error.message;
  return "Permintaan belum berhasil. Periksa koneksi lalu coba lagi.";
}
