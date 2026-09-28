"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { PlatformService } from "@/features/platform/application/platform-service";
import { DemoPlatformRepository } from "@/features/platform/infrastructure/demo-platform-repository";
import { HttpPlatformRepository } from "@/features/platform/infrastructure/http-platform-repository";
import { ApiClient } from "@/shared/http/api-client";
import { apiBaseUrl, getAuthClient } from "@/shared/auth/supabase";
import { Button } from "@/shared/ui/button";
import { PlatformError, errorMessage } from "@/features/platform/domain/errors";

const identitySchema = z.object({
  user_id: z.uuid(),
  roles: z.array(z.object({ role: z.string() })),
});
const Context = createContext<{
  service: PlatformService;
  demo: boolean;
} | null>(null);
export function usePlatform() {
  const context = useContext(Context);
  if (!context) throw new Error("PlatformProvider is required");
  return context;
}
export function PlatformProvider({
  demo,
  children,
}: {
  demo: boolean;
  children: ReactNode;
}) {
  const [service, setService] = useState<PlatformService | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const router = useRouter();
  useEffect(() => {
    let active = true;
    async function initialize() {
      if (demo) {
        if (active)
          setService(
            new PlatformService(
              new DemoPlatformRepository(window.localStorage),
            ),
          );
        return;
      }
      const auth = getAuthClient();
      if (!auth || !apiBaseUrl) {
        setError(
          "Koneksi platform belum diatur. Lengkapi konfigurasi Supabase dan backend terlebih dahulu.",
        );
        return;
      }
      const { data, error: authError } = await auth.auth.getUser();
      if (!active) return;
      if (authError || !data.user) {
        router.replace("/login");
        return;
      }
      const api = new ApiClient(
        apiBaseUrl,
        async () =>
          (await auth.auth.getSession()).data.session?.access_token ?? null,
      );
      const identity = await api.request("/me", identitySchema);
      if (!identity.roles.some((r) => r.role === "platform_admin"))
        throw new PlatformError(
          "FORBIDDEN",
          "Akun ini tidak memiliki akses Admin Platform.",
        );
      if (active)
        setService(new PlatformService(new HttpPlatformRepository(api)));
    }
    initialize().catch((e: unknown) => {
      if (active) setError(errorMessage(e));
    });
    const subscription = demo
      ? null
      : getAuthClient()?.auth.onAuthStateChange((event) => {
          if (event === "SIGNED_OUT") {
            setService(null);
            router.replace("/login");
          }
        }).data.subscription;
    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, [demo, router, attempt]);
  if (error)
    return (
      <main className="access-state">
        <h1>Akses platform belum tersedia</h1>
        <p role="alert">{error}</p>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              setError(null);
              setAttempt((v) => v + 1);
            }}
          >
            Coba lagi
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              await getAuthClient()?.auth.signOut();
              router.replace("/login");
            }}
          >
            Kembali ke masuk
          </Button>
        </div>
      </main>
    );
  if (!service)
    return (
      <main className="access-state" role="status">
        <span className="loader" />
        <p>Menyiapkan platform…</p>
      </main>
    );
  return (
    <Context.Provider value={{ service, demo }}>{children}</Context.Provider>
  );
}
