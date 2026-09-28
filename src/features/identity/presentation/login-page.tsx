"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BookOpen, Building2, ShieldCheck } from "lucide-react";
import { getAuthClient, apiBaseUrl } from "@/shared/auth/supabase";
import { Field } from "@/shared/ui/field";
import { Button } from "@/shared/ui/button";

export function LoginPage({ demoEnabled }: { demoEnabled: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
    apiBaseUrl,
  );
  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const auth = getAuthClient();
    if (!auth) return;
    const values = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    try {
      const result = await auth.auth.signInWithPassword({
        email: String(values.get("email")).trim(),
        password: String(values.get("password")),
      });
      if (result.error) {
        setError(
          "Email atau kata sandi belum cocok. Periksa kembali lalu coba lagi.",
        );
        return;
      }
      router.replace("/platform/schools");
    } catch {
      setError("Belum dapat masuk. Periksa koneksi lalu coba lagi.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="login-layout">
      <section className="login-story">
        <Link href="/login" className="brand">
          <span className="brand-mark">n</span>
          <span>nalar</span>
        </Link>
        <div>
          <p className="eyebrow">RUANG UNTUK BERNALAR</p>
          <h1>Pembelajaran yang bermakna dimulai dari fondasi yang baik.</h1>
          <p>
            Kelola sekolah dan referensi kurikulum. Siapkan ruang bagi guru
            untuk memahami cara siswa berpikir.
          </p>
          <div className="login-features">
            <span>
              <Building2 size={18} />
              Administrasi sekolah
            </span>
            <span>
              <BookOpen size={18} />
              Kurikulum nasional
            </span>
            <span>
              <ShieldCheck size={18} />
              Akses sesuai peran
            </span>
          </div>
        </div>
        <p className="text-xs opacity-70">
          NALAR · Pendamping penalaran untuk sekolah Indonesia
        </p>
      </section>
      <section className="login-form">
        <span className="stat-icon blue mb-6">
          <ShieldCheck size={24} />
        </span>
        <p className="eyebrow">ADMIN PLATFORM</p>
        <h2>Selamat datang kembali.</h2>
        <p className="text-sm text-muted-foreground mt-3 mb-7">
          Masuk dengan akun pengelola platform Anda.
        </p>
        {!configured && (
          <p className="info-box mb-6" role="status">
            Koneksi Supabase dan backend belum diatur.{" "}
            {demoEnabled
              ? "Anda dapat menjelajahi demo lokal di bawah."
              : "Hubungi pengelola untuk mengatur koneksi platform."}
          </p>
        )}
        <form onSubmit={signIn} className="space-y-5">
          <fieldset disabled={busy || !configured} className="space-y-5">
            <Field
              id="login-email"
              name="email"
              label="Email"
              type="email"
              placeholder="nama@nalar.id"
              autoComplete="username"
              required
            />
            <Field
              id="login-password"
              name="password"
              label="Kata sandi"
              type="password"
              placeholder="Masukkan kata sandi"
              autoComplete="current-password"
              required
            />
            <Button
              type="submit"
              disabled={busy || !configured}
              className="w-full"
            >
              {busy ? "Memeriksa akun…" : "Masuk ke platform"}
              <ArrowRight size={17} />
            </Button>
          </fieldset>
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
        </form>
        {demoEnabled && (
          <Link className="demo-link" href="/demo/platform/schools">
            Jelajahi demo lokal
            <ArrowRight size={16} />
          </Link>
        )}
        <p className="mt-7 text-xs leading-6 text-muted-foreground">
          Akses Admin Platform hanya mencakup metadata sekolah dan referensi
          kurikulum nasional.
        </p>
      </section>
    </main>
  );
}
