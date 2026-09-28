"use client";
import { useCallback, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  FileText,
  Layers3,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { usePlatform } from "@/composition/platform-provider";
import { Button } from "@/shared/ui/button";
import { cn, date, number } from "@/shared/lib/utils";
import { usePlatformData } from "./use-platform-data";
import { CurriculumDialog } from "./curriculum-dialog";

export function CurriculumPage() {
  const { service } = usePlatform();
  const load = useCallback(
    (cursor?: string) => service.listCurricula(cursor),
    [service],
  );
  const { items, loading, error, reload } = usePlatformData(load);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [subjectIndex, setSubjectIndex] = useState(0);
  const [showPublish, setShowPublish] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const selected = items.find((v) => v.id === selectedId) ?? items[0];
  const subject = selected?.subjects[subjectIndex] ?? selected?.subjects[0];
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">REFERENSI KURIKULUM</p>
          <h1>Capaian Pembelajaran</h1>
          <p className="page-description">
            Satu referensi nasional. Fondasi untuk setiap ruang belajar.
          </p>
        </div>
        <Button
          disabled={loading || Boolean(error)}
          onClick={() => setShowPublish(true)}
        >
          <Plus size={18} />
          Terbitkan versi baru
        </Button>
      </div>
      {notice && (
        <div role="status" className="success-notice">
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
      <div className="curriculum-note">
        <span className="stat-icon blue">
          <Layers3 size={20} />
        </span>
        <div>
          <h2>Kurikulum berkembang. Pemetaan tetap terjaga.</h2>
          <p>
            Versi baru tidak mengubah pemetaan sekolah atau misi yang sudah ada.
            Perpindahan versi dikelola oleh masing-masing sekolah.
          </p>
        </div>
      </div>
      {loading ? (
        <section className="panel empty-state" role="status">
          <span className="loader" />
          <p>Memuat referensi kurikulum…</p>
        </section>
      ) : error ? (
        <section className="panel empty-state">
          <p role="alert">{error}</p>
          <Button variant="outline" onClick={reload}>
            Coba lagi
          </Button>
        </section>
      ) : !items.length ? (
        <section className="panel empty-state">
          <BookOpen size={32} />
          <h3>Belum ada versi CP</h3>
          <p>
            Terbitkan referensi nasional pertama dari berkas yang telah
            ditinjau.
          </p>
          <Button onClick={() => setShowPublish(true)}>
            Terbitkan versi baru
          </Button>
        </section>
      ) : (
        <div className="curriculum-grid">
          <section className="panel version-panel">
            <div className="panel-title">
              <div>
                <h2>
                  Versi nasional{" "}
                  <span className="count-pill">{items.length}</span>
                </h2>
                <p>Pilih versi untuk membaca referensi.</p>
              </div>
            </div>
            <div className="version-list">
              {items.map((v) => (
                <button
                  key={v.id}
                  className={cn(
                    "version-card",
                    selected?.id === v.id && "version-selected",
                  )}
                  onClick={() => {
                    setSelectedId(v.id);
                    setSubjectIndex(0);
                  }}
                  aria-pressed={selected?.id === v.id}
                >
                  <span className="flex justify-between gap-2">
                    <strong>{v.decree_code}</strong>
                    <span
                      className={cn(
                        "badge",
                        v.status === "published"
                          ? "badge-green"
                          : "badge-neutral",
                      )}
                    >
                      {v.status === "published"
                        ? "Terbit"
                        : v.status === "draft"
                          ? "Draf"
                          : "Arsip"}
                    </span>
                  </span>
                  <span className="version-title">{v.title}</span>
                  <span className="version-meta">
                    {v.published_at
                      ? `Diterbitkan ${date(v.published_at)}`
                      : "Belum diterbitkan"}
                  </span>
                  <span className="version-bottom">
                    <span>
                      {number(v.mapped_school_count)} sekolah memetakan
                    </span>
                    <ArrowRight size={15} />
                  </span>
                </button>
              ))}
            </div>
            <p className="version-footnote">
              <ShieldCheck size={14} />
              Referensi sebelumnya tetap tersimpan.
            </p>
          </section>
          <section className="panel outcomes-panel">
            <div className="panel-title">
              <div>
                <p className="eyebrow mb-2">ISI REFERENSI</p>
                <h2>{selected?.decree_code}</h2>
                <p>
                  Berlaku{" "}
                  {selected
                    ? date(`${selected.effective_on}T00:00:00+07:00`)
                    : "—"}
                </p>
              </div>
              <span className="stat-icon blue">
                <BookOpen size={19} />
              </span>
            </div>
            <div className="subject-filter">
              <label htmlFor="cp-subject">Mata pelajaran dan fase</label>
              <div className="filter-select">
                <select
                  id="cp-subject"
                  value={subjectIndex}
                  onChange={(e) => setSubjectIndex(Number(e.target.value))}
                >
                  {selected?.subjects.map((s, i) => (
                    <option key={`${s.name}-${s.phase}`} value={i}>
                      {s.name} · Fase {s.phase}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} />
              </div>
            </div>
            <div className="outcomes-list">
              {subject?.outcomes.map((outcome, i) => (
                <article className="outcome" key={`${outcome.element}-${i}`}>
                  <span className="outcome-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{outcome.element}</h3>
                    <p>{outcome.description}</p>
                    <div className="statement-list">
                      <span>
                        <FileText size={13} />
                        Pernyataan CP
                      </span>
                      <ul>
                        {outcome.statements.map((statement, j) => (
                          <li key={j}>{statement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="table-footer">
              <span>
                {subject?.outcomes.length ?? 0} elemen ·{" "}
                {subject?.outcomes.reduce(
                  (sum, o) => sum + o.statements.length,
                  0,
                ) ?? 0}{" "}
                pernyataan
              </span>
              <span>Referensi berversi</span>
            </div>
          </section>
        </div>
      )}
      {showPublish && (
        <CurriculumDialog
          onClose={() => setShowPublish(false)}
          onSaved={(message) => {
            setShowPublish(false);
            setSelectedId(null);
            setSubjectIndex(0);
            setNotice(message);
            reload();
          }}
        />
      )}
    </>
  );
}
