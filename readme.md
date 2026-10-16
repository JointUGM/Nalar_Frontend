# NALAR Frontend

Frontend NALAR untuk pembelajaran berbasis misi dan dialog, pengelolaan materi oleh guru, serta administrasi sekolah dan platform. Antarmuka menggunakan Bahasa Indonesia dan dibangun dengan React, TypeScript, serta Vite.

Repositori ini berisi aplikasi frontend. Backend dijalankan dan dikonfigurasi secara terpisah.

## Prasyarat

- Node.js `^22.13.0` atau `>=24.0.0`, sesuai `package.json`.
- npm; gunakan `package-lock.json` yang tersedia.
- Backend yang dapat diakses dan akun aktif dengan peran yang sesuai untuk mencoba fitur terintegrasi. Akun pengujian tersedia di bagian detail akun; tidak ada pendaftaran mandiri.

## Menjalankan aplikasi

Jalankan perintah berikut melalui PowerShell dari direktori proyek:

```powershell
cd C:\Code\Nalar\Nalar_Frontend
npm ci
```

Jika `.env.local` belum tersedia, salin contoh konfigurasi:

```powershell
Copy-Item .env.example .env.local
```

Isi `.env.local` dengan konfigurasi berikut:

```dotenv
VITE_API_BASE_URL=https://nalarbackend-production.up.railway.app/api/v1
```

Kemudian jalankan:

```powershell
npm run dev
```

Buka alamat yang ditampilkan Vite, biasanya [http://localhost:5173](http://localhost:5173). Halaman `/` menampilkan landing page; buka `/login` untuk masuk.

`VITE_API_BASE_URL` yang kosong atau tidak valid membuat layanan akun dan fitur terintegrasi tidak tersedia. Landing page dan halaman contoh akun tetap dapat dibuka.

### Menghubungkan backend

Browser mengirim permintaan ke `/api/v1` pada origin frontend. Saat development, `vite.config.ts` meneruskan permintaan tersebut ke backend Railway yang sudah dikonfigurasi.

Untuk memakai backend lokal, tentukan target proxy sebelum menjalankan Vite. Contoh berikut mengasumsikan backend tersedia di port `8000`; sesuaikan dengan backend Anda:

```powershell
$env:NALAR_API_PROXY_TARGET = 'http://localhost:8000'
npm run dev
```

Nilai `VITE_API_BASE_URL` di atas dapat tetap digunakan; `/api/v1` juga merupakan nilai yang valid. `NALAR_API_PROXY_TARGET` adalah variabel proses Vite; isi dengan origin backend tanpa akhiran `/api/v1`, karena path permintaan sudah menyertakannya. Preview lokal juga mewarisi proxy server pada versi Vite yang terpasang.

Mengisi `VITE_API_BASE_URL` dengan URL absolut tidak mengganti target proxy: resolver aplikasi tetap menggunakan `/api/v1`. Ubah target proxy untuk memilih backend development.

Pastikan origin frontend diizinkan oleh konfigurasi backend untuk alur Auth. Restart Vite setelah mengubah konfigurasi environment. Semua nilai `VITE_*` masuk ke bundle browser; jangan isi dengan secret, service-role key, atau kredensial database.

## Detail akun pengujian

Gunakan akun berikut pada halaman `/login`. Kredensial disediakan oleh pemilik proyek untuk pengujian; akses aktual tetap mengikuti identitas dan keanggotaan pada backend.

| Peran | Email | Password |
| --- | --- | --- |
| Admin Platform | `platform.uat@uat.nalar.id` | `Uji-Nalar-2026!` |
| Admin Sekolah | `kepsek.uat@uat.nalar.id` | `Uji-Nalar-2026!` |
| Guru | `bryanthanaya4@gmail.com` | `teacher123` |
| Siswa | `bryanthanaya2@gmail.com` | `student123` |

Masukkan email dan password sesuai tabel, lalu pilih masuk. Jika akun memiliki beberapa peran, pilih peran yang ingin diuji. ID sekolah dan tujuan navigasi ditentukan dari respons backend, sehingga tidak perlu mengisi ID sekolah secara manual.

Kredensial yang dicantumkan di README dapat dibaca oleh setiap orang yang memiliki akses ke repositori, termasuk pengunjung jika repositori GitHub bersifat publik.

## Alur penggunaan

1. Pengguna membuka landing page dan memilih masuk. Akun undangan mengikuti tautan `/activate` dari email untuk menetapkan kata sandi terlebih dahulu. Pemulihan kata sandi tersedia melalui `/reset-password`.
2. Frontend mengirim login ke backend. Sesi menggunakan cookie HttpOnly; browser tidak menyimpan token Auth di localStorage.
3. Frontend memeriksa identitas dan hak akses melalui `/me`. Akun dengan satu peran diarahkan ke halaman terkait; akun dengan beberapa peran dapat memilih peran. Akses URL terlindungi tetap diperiksa.
4. Pengguna menjalankan alur sesuai perannya:

| Peran | Halaman utama | Alur utama |
| --- | --- | --- |
| Admin Platform | `/platform` | Mengelola sekolah, kurikulum/referensi resmi, serta memantau penggunaan AI dan audit. |
| Admin Sekolah | `/school/{school}` | Mengelola tahun ajaran, kelas, pengguna, penugasan guru, impor roster, dan undangan akun. |
| Guru | `/teacher/{school}` | Mengunggah PDF ke basis pengetahuan, meninjau konsep, membuat dan meninjau misi, lalu menerbitkannya ke kelas. Memantau sesi dan meninjau laporan siswa. |
| Siswa | `/student/{school}` | Membuka misi yang tersedia atau bergabung menggunakan kode sesi, mengerjakan dialog, lalu melihat refleksi setelah sesi selesai. |

`{school}` adalah ID sekolah dari identitas backend, bukan teks yang diketik secara literal. Hak akses dan ketersediaan tindakan mengikuti respons backend.

Alur belajar utamanya adalah **materi → konsep yang disetujui → misi → peninjauan versi → publikasi → sesi siswa → laporan dan tindak lanjut guru**. Publikasi dapat berupa sesi langsung atau jendela waktu. Pekerjaan asinkron seperti pemrosesan materi dan pembuatan draf dipantau melalui status job backend.

### Halaman contoh desain

Halaman `/review/account/activate`, `/review/account/reset`, dan `/review/account/password` menampilkan contoh desain akun. Gunakan `/activate`, `/reset-password`, dan `/login` untuk alur akun sebenarnya. Halaman contoh bukan cara memperoleh sesi atau hak akses.

Preview komponen dasar tersedia saat development melalui `/?preview=foundation`.

## Arsitektur dan alur data

Aplikasi memakai empat lapisan dengan dependency injection di `src/di.ts`:

| Lokasi | Tanggung jawab |
| --- | --- |
| `src/domain/` | Model bisnis, aturan murni, dan kontrak layanan. |
| `src/application/` | Use case, validasi, dan orkestrasi alur bisnis. |
| `src/infrastructure/` | Implementasi HTTP, pemetaan respons API, dan penanganan transport. |
| `src/ui/` | Halaman, komponen, hook, styling, dan state interaksi. |

Alur permintaan: **interaksi pengguna → UI/hook → use case → kontrak domain → adapter HTTP → backend**. Respons dipetakan oleh adapter menjadi model domain untuk ditampilkan UI.

`src/main.tsx` memasang aplikasi, router, error boundary, dan pemuatan modul secara lazy. `src/di.ts` menyusun layanan konkret dan menyuntikkan use case. UI tidak mengimpor adapter infrastruktur secara langsung.

File penting lainnya:

- `contracts/backend.openapi.json`: kontrak backend yang dipatok di repositori.
- `src/infrastructure/services/contracts/backend.ts`: tipe hasil generate; jangan diedit manual.
- `public/`: aset statis dan lisensi font.
- `vite.config.ts`: konfigurasi Vite, alias `@/`, proxy development, dan Vitest.
- `vercel.json`: konfigurasi build, proxy API, serta fallback rute SPA untuk Vercel.

## Pemeriksaan kualitas

Untuk memverifikasi perubahan source, jalankan:

```powershell
npm run typecheck
npm run lint
npm test
npm run build
```

Lint juga memeriksa batas arsitektur dan kesesuaian tipe dengan kontrak backend. `npm run verify` menjalankan pemeriksaan tersebut dengan pengujian melalui `test:ci`, yang menggunakan Node 22 lewat `npx` dan dapat memerlukan akses jaringan.

Perintah tambahan:

| Perintah | Kegunaan |
| --- | --- |
| `npm run test:watch` | Menjalankan Vitest dalam mode watch. |
| `npm run contract:check` | Memastikan tipe hasil generate sesuai kontrak yang dipatok. |
| `npm run contract:generate` | Membuat ulang tipe setelah perubahan kontrak yang sudah ditinjau. |
| `npm run test:e2e` | Menjalankan pengujian browser Playwright. |

Sebelum pengujian browser pertama, pasang Chromium:

```powershell
npx playwright install chromium --only-shell
npm run test:e2e
```

Pengujian E2E memakai server Vite terisolasi di port `5187` dan intersepsi Auth/API sintetis. Hasilnya tidak membuktikan koneksi atau otorisasi pada backend nyata.

## Build dan preview

```powershell
npm run build
npm run preview
```

Build menghasilkan direktori `dist/`. Buka alamat preview yang ditampilkan terminal. `vite preview` digunakan untuk memeriksa hasil build lokal dan mewarisi proxy API dari konfigurasi server. Jika memakai backend lokal, tetapkan `NALAR_API_PROXY_TARGET` pada terminal yang menjalankan preview juga. Pastikan backend mengizinkan origin preview jika alur Auth memerlukannya.

Pada Vercel, konfigurasi yang tersedia meneruskan `/api/v1/*` ke backend Railway dan rute lainnya ke `index.html`. Jika memakai host lain, sediakan proxy API dan fallback SPA yang setara agar login serta pembukaan URL langsung tetap bekerja. Perubahan nilai `VITE_*` pada build produksi memerlukan build ulang.

## Pemecahan masalah

| Gejala | Pemeriksaan |
| --- | --- |
| Form login tidak tersedia | Pastikan `.env.local` berisi `VITE_API_BASE_URL=https://nalarbackend-production.up.railway.app/api/v1`, lalu restart Vite. |
| Login atau permintaan API gagal | Periksa tab Network, target proxy, ketersediaan backend, cookie sesi, dan origin frontend yang diizinkan backend. |
| Akses peran ditolak | Periksa akun, keanggotaan sekolah, dan peran dari `/me`; mengubah URL tidak memberi hak akses. |
| URL langsung menghasilkan 404 pada hosting | Pastikan host memiliki fallback ke `index.html` setelah aturan proxy API. |
| Fitur API gagal pada preview build | Periksa nilai environment saat build, target proxy saat preview, dan izin origin preview pada backend. |
| Pemeriksaan kontrak gagal | Tinjau kontrak yang dipatok dan tipe hasil generate; lakukan generate ulang hanya jika perubahan kontrak memang disengaja. |

## Dokumentasi lanjutan

- `docs/project_structure.md`: struktur proyek dan batas dependency.
- `docs/agent.md`: kesepakatan kerja proyek.
- `docs/design.md`: panduan desain.
- `docs/superpowers/plans/2026-10-02-backend-integration-roadmap.md`: roadmap integrasi backend.

Dokumen `docs/` bersifat lokal dan tidak disertakan di GitHub. Dokumentasi lokal dapat memuat catatan historis; gunakan kode dan kontrak yang dipatok untuk memastikan perilaku saat ini.

## Memasukkan README ke GitHub

`.gitignore` mengecualikan `/readme.md` dari aturan pengabaian Markdown, sehingga README ini dapat ditambahkan ke Git. Dokumentasi Markdown lainnya tetap diabaikan.

Untuk menyimpan dan mengirim perubahan README beserta aturan Git-nya, jalankan sendiri dari direktori proyek:

```powershell
git add .gitignore readme.md
git commit -m "docs: add setup guide and test account details"
git push -u origin HEAD
```

Perintah push mengirim commit ke branch aktif; integrasikan branch tersebut ke branch default jika README ingin ditampilkan pada halaman utama repositori.
