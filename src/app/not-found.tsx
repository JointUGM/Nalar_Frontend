import Link from "next/link";
export default function NotFound() {
  return (
    <main className="access-state">
      <h1>Halaman tidak ditemukan</h1>
      <p>Halaman ini belum tersedia.</p>
      <Link href="/login" className="text-primary font-semibold">
        Kembali ke masuk
      </Link>
    </main>
  );
}
