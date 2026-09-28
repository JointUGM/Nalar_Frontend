"use client";
import { useCallback, useState } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Clock3,
  Mail,
  Plus,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { usePlatform } from "@/composition/platform-provider";
import { Button } from "@/shared/ui/button";
import { date, number, cn } from "@/shared/lib/utils";
import { usePlatformData } from "./use-platform-data";
import { SchoolDialog, type SchoolAction } from "./school-dialog";
import type { School } from "../domain/models";
import { Dialog } from "@/shared/ui/dialog";

export function SchoolsPage() {
  const { service } = usePlatform();
  const load = useCallback(() => service.listSchools(), [service]);
  // Pass cursors through to the repository so global totals never use only page one.
  const paginatedLoad = useCallback(
    (cursor?: string) => (cursor ? service.listSchools(cursor) : load()),
    [service, load],
  );
  const { items, loading, error, reload } = usePlatformData(paginatedLoad);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [action, setAction] = useState<SchoolAction | null>(null);
  const [detail, setDetail] = useState<School | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const filtered = items.filter(
    (s) =>
      (status === "all" ||
        s.status === status ||
        (status === "invited" && s.admin.invitation_status === "pending")) &&
      `${s.name} ${s.npsn} ${s.admin.email}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  const active = items.filter((s) => s.status === "active").length;
  const pending = items.filter(
    (s) => s.admin.invitation_status === "pending",
  ).length;
  function saved(message: string) {
    setAction(null);
    setNotice(message);
    reload();
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">ADMINISTRASI PLATFORM</p>
          <h1>Sekolah</h1>
          <p className="page-description">
            Siapkan ruang belajar. Kelola sekolah yang tumbuh bersama NALAR.
          </p>
        </div>
        <Button
          disabled={loading || Boolean(error)}
          onClick={() => setAction({ kind: "create" })}
        >
          <Plus size={18} />
          Daftarkan sekolah
        </Button>
      </div>
      {notice && (
        <div className="success-notice" role="status">
          <Check size={17} />
          {notice}
          <button
            aria-label="Tutup pemberitahuan"
            onClick={() => setNotice(null)}
          >
            ×
          </button>
        </div>
      )}
      <div className="stats-grid">
        {[
          {
            label: "Sekolah aktif",
            value: active,
            detail: `dari ${number(items.length)} sekolah terdaftar`,
            icon: Building2,
            tone: "blue",
          },
          {
            label: "Pengguna terdaftar",
            value: items.reduce((sum, s) => sum + s.user_count, 0),
            detail: "akun di seluruh sekolah",
            icon: Users,
            tone: "green",
          },
          {
            label: "Undangan admin",
            value: pending,
            detail: "menunggu aktivasi akun",
            icon: MailIcon,
            tone: "orange",
          },
        ].map(({ label, value, detail: caption, icon: Icon, tone }) => (
          <div className="stat-card" key={label}>
            <div className="flex items-center justify-between">
              <span>{label}</span>
              <span className={`stat-icon ${tone}`}>
                <Icon size={18} />
              </span>
            </div>
            <strong>{loading || error ? "—" : number(value)}</strong>
            <p>{loading || error ? "Menunggu data sekolah" : caption}</p>
          </div>
        ))}
      </div>
      <section className="panel">
        <div className="panel-title">
          <div>
            <h2>
              Daftar sekolah{" "}
              <span className="count-pill">
                {loading || error ? "—" : items.length}
              </span>
            </h2>
            <p>Informasi institusi, admin, dan status akses platform.</p>
          </div>
          <span className="text-xs text-muted-foreground hidden md:flex items-center gap-1.5">
            <ShieldCheck size={14} />
            Metadata saja
          </span>
        </div>
        <div className="table-toolbar">
          <div className="search-input">
            <Search size={18} />
            <input
              aria-label="Cari sekolah"
              placeholder="Cari nama sekolah, NPSN, atau email admin…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="filter-select">
            <select
              aria-label="Filter status sekolah"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">Semua status</option>
              <option value="active">Aktif</option>
              <option value="suspended">Ditangguhkan</option>
              <option value="invited">Admin diundang</option>
            </select>
            <ChevronDown size={14} />
          </div>
        </div>
        {loading ? (
          <div className="empty-state" role="status">
            <span className="loader" />
            <p>Memuat daftar sekolah…</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <p role="alert">{error}</p>
            <Button variant="outline" onClick={reload}>
              Coba lagi
            </Button>
          </div>
        ) : !filtered.length ? (
          <div className="empty-state">
            <Building2 size={32} />
            <h3>
              {items.length
                ? "Sekolah tidak ditemukan"
                : "Belum ada sekolah terdaftar"}
            </h3>
            <p>
              {items.length
                ? "Coba kata kunci lain atau ubah filter status."
                : "Daftarkan sekolah pertama dan undang adminnya."}
            </p>
            {items.length ? (
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setStatus("all");
                }}
              >
                Reset pencarian
              </Button>
            ) : (
              <Button onClick={() => setAction({ kind: "create" })}>
                Daftarkan sekolah
              </Button>
            )}
          </div>
        ) : (
          <div className="table-scroll">
            <table>
              <caption className="sr-only">
                Metadata sekolah yang terdaftar di NALAR
              </caption>
              <thead>
                <tr>
                  <th>Sekolah</th>
                  <th>Admin sekolah</th>
                  <th className="text-right">Pengguna</th>
                  <th>Status</th>
                  <th>
                    <span className="sr-only">Tindakan</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((school, index) => (
                  <tr key={school.id}>
                    <td>
                      <div className="school-cell">
                        <span
                          className={cn(
                            "school-icon",
                            index % 3 === 1 && "school-icon-green",
                            index % 3 === 2 && "school-icon-orange",
                          )}
                        >
                          <Building2 size={20} />
                        </span>
                        <div>
                          <button
                            className="school-name"
                            onClick={() => setDetail(school)}
                          >
                            {school.name}
                          </button>
                          <p>NPSN {school.npsn}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="admin-cell">
                        <span className="small-avatar">
                          {school.admin.email.slice(0, 2).toUpperCase()}
                        </span>
                        <div>
                          <span className="admin-email">
                            {school.admin.email}
                          </span>
                          <p>
                            {school.admin.invitation_status === "pending"
                              ? "Menunggu aktivasi"
                              : "Admin terverifikasi"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="text-right font-semibold tabular-nums">
                      {number(school.user_count)}
                    </td>
                    <td>
                      <span
                        className={cn(
                          "badge",
                          school.status === "suspended"
                            ? "badge-neutral"
                            : school.admin.invitation_status === "pending"
                              ? "badge-orange"
                              : "badge-green",
                        )}
                      >
                        {school.status === "suspended" ? (
                          <Clock3 size={12} />
                        ) : school.admin.invitation_status === "pending" ? (
                          <Clock3 size={12} />
                        ) : (
                          <CircleCheck size={12} />
                        )}
                        {school.status === "suspended"
                          ? "Ditangguhkan"
                          : school.admin.invitation_status === "pending"
                            ? "Diundang · aktif"
                            : "Aktif"}
                      </span>
                    </td>
                    <td>
                      <Button
                        variant="ghost"
                        className="px-2"
                        aria-label={`Kelola ${school.name}`}
                        onClick={() => setDetail(school)}
                      >
                        <ChevronRight size={18} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && !error && (
          <div className="table-footer">
            <span>
              Menampilkan {number(filtered.length)} dari {number(items.length)}{" "}
              sekolah
            </span>
            <span>Seluruh sekolah</span>
          </div>
        )}
      </section>
      <div className="boundary-note">
        <span className="boundary-icon">
          <ShieldCheck size={22} />
        </span>
        <div>
          <h3>Ruang kelola, dengan batas akses yang jelas.</h3>
          <p>
            Admin Platform mengelola institusi. Sesi, transkrip, dan hasil
            penalaran siswa tetap berada di ruang guru.
          </p>
        </div>
      </div>
      {action && (
        <SchoolDialog
          action={action}
          onClose={() => setAction(null)}
          onSaved={saved}
        />
      )}
      {detail && (
        <Dialog
          open
          onOpenChange={() => setDetail(null)}
          title={detail.name}
          description={`NPSN ${detail.npsn} · Terdaftar ${date(detail.created_at)}`}
        >
          <dl className="detail-list">
            <div>
              <dt>Status sekolah</dt>
              <dd>{detail.status === "active" ? "Aktif" : "Ditangguhkan"}</dd>
            </div>
            <div>
              <dt>Admin sekolah</dt>
              <dd>{detail.admin.email}</dd>
            </div>
            <div>
              <dt>Undangan admin</dt>
              <dd>
                {detail.admin.invitation_status === "accepted"
                  ? "Diterima"
                  : "Menunggu aktivasi"}
              </dd>
            </div>
            <div>
              <dt>Pengguna terdaftar</dt>
              <dd>{number(detail.user_count)}</dd>
            </div>
          </dl>
          <div className="dialog-actions flex-wrap">
            <Button
              variant="outline"
              onClick={() => {
                setAction({ kind: "admin", school: detail });
                setDetail(null);
              }}
            >
              Ganti admin
            </Button>
            <Button
              variant={detail.status === "active" ? "danger" : "default"}
              onClick={() => {
                setAction({ kind: "status", school: detail });
                setDetail(null);
              }}
            >
              {detail.status === "active"
                ? "Tangguhkan sekolah"
                : "Aktifkan sekolah"}
            </Button>
          </div>
        </Dialog>
      )}
    </>
  );
}
function MailIcon({ size }: { size: number }) {
  return <Mail size={size} />;
}
