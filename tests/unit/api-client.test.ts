import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { ApiClient } from "../../src/shared/http/api-client";

afterEach(() => {
  vi.unstubAllGlobals();
});
describe("backend HTTP boundary", () => {
  it("sends bearer identity and an idempotency key on mutations", async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ saved: true }));
    vi.stubGlobal("fetch", fetcher);
    const api = new ApiClient(
      "https://backend.example.com/api/v1/",
      async () => "token",
    );
    await api.request("/platform/schools", z.object({ saved: z.boolean() }), {
      method: "POST",
      body: { name: "SMP" },
      key: "stable-key",
    });
    expect(fetcher).toHaveBeenCalledWith(
      "https://backend.example.com/api/v1/platform/schools",
      expect.objectContaining({
        cache: "no-store",
        headers: {
          Authorization: "Bearer token",
          "Content-Type": "application/json",
          "Idempotency-Key": "stable-key",
        },
        body: '{"name":"SMP"}',
      }),
    );
  });
  it("never sends a request without a session", async () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    await expect(
      new ApiClient("https://example.com", async () => null).request(
        "/me",
        z.object({}),
      ),
    ).rejects.toMatchObject({ code: "UNAUTHENTICATED" });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("strips unrequested response fields before returning to presentation", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          Response.json({ count: 12, transcript: "private", scores: [4] }),
        ),
    );
    const result = await new ApiClient(
      "https://example.com",
      async () => "token",
    ).request("/metadata", z.object({ count: z.number() }));
    expect(result).toEqual({ count: 12 });
  });
  it("rejects malformed success responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ count: "fake" })),
    );
    await expect(
      new ApiClient("https://example.com", async () => "token").request(
        "/metadata",
        z.object({ count: z.number() }),
      ),
    ).rejects.toMatchObject({ code: "CONTRACT_INVALID" });
  });
  it("keeps error code and request ID without returning private details", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json(
          {
            error: {
              code: "FORBIDDEN",
              message: "Akses ditolak",
              details: { secret: "hidden" },
            },
            request_id: "request-one",
          },
          { status: 403 },
        ),
      ),
    );
    await expect(
      new ApiClient("https://example.com", async () => "token").request(
        "/metadata",
        z.object({}),
      ),
    ).rejects.toMatchObject({
      code: "FORBIDDEN",
      message: "Akses ditolak",
      requestId: "request-one",
    });
  });
  it("turns network failure into a retryable user message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Network failed")),
    );
    await expect(
      new ApiClient("https://example.com", async () => "token").request(
        "/metadata",
        z.object({}),
      ),
    ).rejects.toMatchObject({ code: "NETWORK_ERROR" });
  });
});
