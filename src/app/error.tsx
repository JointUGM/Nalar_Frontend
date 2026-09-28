"use client";
import { Button } from "@/shared/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="access-state">
      <h1>Halaman belum dapat ditampilkan</h1>
      <p role="alert">Coba muat ulang halaman ini.</p>
      <Button onClick={reset}>Coba lagi</Button>
    </main>
  );
}
