import { z } from "zod";
import { PlatformError } from "@/features/platform/domain/errors";

const errorSchema = z.object({
  error: z.object({ code: z.string(), message: z.string() }),
  request_id: z.string().optional(),
});
export class ApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly accessToken: () => Promise<string | null>,
  ) {}
  async request<T>(
    path: string,
    schema: z.ZodType<T>,
    options?: { method: string; body: unknown; key: string },
  ): Promise<T> {
    const token = await this.accessToken();
    if (!token)
      throw new PlatformError(
        "UNAUTHENTICATED",
        "Sesi masuk berakhir. Silakan masuk kembali.",
      );
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl.replace(/\/$/, "")}${path}`, {
        method: options?.method ?? "GET",
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
        headers: {
          Authorization: `Bearer ${token}`,
          ...(options
            ? {
                "Content-Type": "application/json",
                "Idempotency-Key": options.key,
              }
            : {}),
        },
        body: options ? JSON.stringify(options.body) : undefined,
      });
    } catch {
      throw new PlatformError(
        "NETWORK_ERROR",
        "Server belum dapat dihubungi. Periksa koneksi lalu coba lagi.",
      );
    }
    const body: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      const parsed = errorSchema.safeParse(body);
      throw new PlatformError(
        parsed.success ? parsed.data.error.code : `HTTP_${response.status}`,
        parsed.success
          ? parsed.data.error.message
          : "Server belum dapat memproses permintaan.",
        parsed.success ? parsed.data.request_id : undefined,
      );
    }
    const result = schema.safeParse(body);
    if (!result.success)
      throw new PlatformError(
        "CONTRACT_INVALID",
        "Data dari server belum sesuai. Hubungi pengelola platform.",
      );
    return result.data;
  }
}
