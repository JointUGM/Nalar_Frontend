"use client";
import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  ChevronRight,
  FlaskConical,
  LogOut,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import { usePlatform } from "@/composition/platform-provider";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { getAuthClient } from "@/shared/auth/supabase";

export function PlatformShell({ children }: { children: ReactNode }) {
  const { demo } = usePlatform();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signOutError, setSignOutError] = useState(false);
  const prefix = demo ? "/demo/platform" : "/platform";
  const curriculum = pathname.endsWith("curriculum");
  const links = [
    { href: `${prefix}/schools`, label: "Sekolah", icon: Building2 },
    {
      href: `${prefix}/curriculum`,
      label: "Capaian Pembelajaran",
      icon: BookOpen,
    },
  ];
  async function signOut() {
    if (!demo) {
      const result = await getAuthClient()?.auth.signOut();
      if (result?.error) {
        setSignOutError(true);
        return;
      }
    }
    router.push("/login");
  }
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Langsung ke konten
      </a>
      {mobileOpen && (
        <button
          className="fixed inset-0 z-20 bg-foreground/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Tutup navigasi"
        />
      )}
      <aside
        className={cn("sidebar", mobileOpen && "sidebar-open")}
        aria-label="Navigasi Admin Platform"
      >
        <div className="flex items-center justify-between">
          <Link
            className="brand"
            href={`${prefix}/schools`}
            onClick={() => setMobileOpen(false)}
          >
            <span className="brand-mark">n</span>
            <span>
              nalar<span className="brand-label">PLATFORM</span>
            </span>
          </Link>
          <Button
            className="lg:hidden px-2"
            variant="ghost"
            aria-label="Tutup navigasi"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </Button>
        </div>
        <p className="nav-section">RUANG KERJA</p>
        <nav>
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn("nav-item", pathname === href && "nav-item-active")}
              aria-current={pathname === href ? "page" : undefined}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={19} />
              <span>{label}</span>
              {pathname === href && (
                <ChevronRight size={15} className="ml-auto" />
              )}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="privacy-note">
            <ShieldCheck size={22} />
            <strong>Akses sesuai peran</strong>
            <p>Anda hanya melihat metadata sekolah dan referensi kurikulum.</p>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={signOut}
          >
            <LogOut size={17} />
            {demo ? "Keluar dari demo" : "Keluar"}
          </Button>
          {signOutError && (
            <p role="alert" className="text-xs text-danger">
              Belum berhasil keluar. Coba lagi.
            </p>
          )}
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="lg:hidden px-2"
              aria-label="Buka navigasi"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </Button>
            <span className="hidden sm:inline text-muted-foreground">
              Admin Platform
            </span>
            <ChevronRight className="hidden sm:inline text-border" size={16} />
            <span>{curriculum ? "Capaian Pembelajaran" : "Sekolah"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="environment">
              <span />
              {demo ? "Demo lokal" : "Terhubung"}
            </span>
            <span className="avatar" aria-label="Admin Platform">
              AP
            </span>
          </div>
        </header>
        {demo && (
          <div className="demo-banner">
            <FlaskConical size={16} />
            <p>
              <strong>Mode demo.</strong> Data contoh tersimpan di browser ini.
              Undangan dan perubahan akses disimulasikan.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1 shrink-0"
            >
              Masuk ke platform
              <ArrowUpRight size={14} />
            </Link>
          </div>
        )}
        <main id="main" className="main-content">
          {children}
          <footer className="page-footer">
            <span>
              nalar <span className="font-normal">· Ruang untuk bernalar.</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} />
              Metadata sekolah saja
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
