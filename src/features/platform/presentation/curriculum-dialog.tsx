"use client";
import { useState, type FormEvent } from "react";
import { BookOpen, Check, FileJson, Upload } from "lucide-react";
import { usePlatform } from "@/composition/platform-provider";
import { Button } from "@/shared/ui/button";
import { Dialog } from "@/shared/ui/dialog";
import { Field } from "@/shared/ui/field";
import { curriculumInputSchema, type CurriculumInput } from "../domain/models";
import { errorMessage } from "../domain/errors";

export function CurriculumDialog({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const { service, demo } = usePlatform();
  const [subjects, setSubjects] = useState<CurriculumInput["subjects"] | null>(
    null,
  );
  const [fileName, setFileName] = useState("");
  const [reading, setReading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [submission, setSubmission] = useState<{
    payload: string;
    key: string;
  } | null>(null);
  async function readFile(file?: File) {
    setSubjects(null);
    setFileName("");
    setError(null);
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran berkas maksimal 2 MB.");
      return;
    }
    setReading(true);
    try {
      const parsed = curriculumInputSchema.shape.subjects.safeParse(
        JSON.parse(await file.text()),
      );
      if (!parsed.success) {
        setError(
          "Struktur JSON belum sesuai. Gunakan contoh berkas dengan mata pelajaran, fase, elemen, dan pernyataan CP.",
        );
        return;
      }
      // Recheck cross-subject uniqueness using the full publication schema.
      const checked = curriculumInputSchema.safeParse({
        decree_code: "preview",
        title: "Pratinjau berkas",
        effective_on: "2026-01-01",
        subjects: parsed.data,
      });
      if (!checked.success) {
        setError("Mata pelajaran dan fase tidak boleh duplikat.");
        return;
      }
      setSubjects(parsed.data);
      setFileName(file.name);
    } catch {
      setError(
        "Berkas tidak dapat dibaca sebagai JSON. Periksa format berkas.",
      );
    } finally {
      setReading(false);
    }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || reading) return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = curriculumInputSchema.safeParse({ ...values, subjects });
    if (!parsed.success) {
      setFields(
        Object.fromEntries(
          parsed.error.issues.map((i) => [String(i.path[0]), i.message]),
        ),
      );
      setError("Lengkapi data versi dan unggah berkas CP yang valid.");
      return;
    }
    if (values.confirm !== "on") {
      setError("Konfirmasi bahwa isi kurikulum telah ditinjau.");
      return;
    }
    const payload = JSON.stringify(parsed.data);
    const key =
      submission?.payload === payload ? submission.key : crypto.randomUUID();
    setSubmission({ payload, key });
    setBusy(true);
    setError(null);
    setFields({});
    try {
      await service.publishCurriculum(parsed.data, key);
      onSaved(
        demo
          ? "Versi CP demo tersimpan. Pemetaan contoh sebelumnya tetap utuh."
          : "Versi CP diterbitkan. Pemetaan sekolah sebelumnya tetap utuh.",
      );
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy && !reading) onClose();
      }}
      title="Terbitkan versi CP baru"
      description="Simpan referensi nasional sebagai versi baru. Sekolah memilih sendiri kapan berpindah; pemetaan lama tetap utuh."
    >
      <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
        <fieldset disabled={busy || reading} className="space-y-5">
          <Field
            id="decree-code"
            label="Nomor keputusan"
            name="decree_code"
            placeholder="Contoh: 046/H/KR/2025"
            required
            error={fields.decree_code}
          />
          <Field
            id="cp-title"
            label="Judul versi"
            name="title"
            placeholder="Capaian Pembelajaran Pendidikan Dasar"
            required
            error={fields.title}
          />
          <Field
            id="effective-on"
            label="Tanggal berlaku"
            name="effective_on"
            type="date"
            required
            error={fields.effective_on}
          />
          <div className="field">
            <label htmlFor="cp-file">Berkas kurikulum</label>
            <div className="upload-zone">
              <Upload size={22} />
              <strong>
                {reading ? "Membaca berkas…" : fileName || "Pilih berkas JSON"}
              </strong>
              <span>Maks. 2 MB · elemen dan pernyataan CP</span>
              <input
                id="cp-file"
                type="file"
                accept="application/json,.json"
                aria-label="Unggah berkas kurikulum JSON"
                onChange={(e) => {
                  void readFile(e.target.files?.[0]);
                  e.currentTarget.value = "";
                }}
              />
            </div>
            <a
              className="text-primary text-xs font-semibold inline-flex gap-1 items-center"
              href="/cp-example.json"
              download
            >
              <FileJson size={13} />
              Unduh contoh format JSON
            </a>
          </div>
          {subjects && (
            <div className="info-box">
              <BookOpen size={18} />
              <div>
                <strong>
                  {subjects.length} mata pelajaran ·{" "}
                  {subjects.reduce(
                    (sum, s) =>
                      sum +
                      s.outcomes.reduce(
                        (count, o) => count + o.statements.length,
                        0,
                      ),
                    0,
                  )}{" "}
                  pernyataan CP
                </strong>
                <p>
                  {subjects
                    .map((s) => `${s.name} (Fase ${s.phase})`)
                    .join(", ")}
                </p>
                <p className="mt-1 flex gap-1 items-center text-green-800">
                  <Check size={13} />
                  Format valid, siap ditinjau.
                </p>
              </div>
            </div>
          )}
          <label className="flex gap-3 items-start text-sm leading-6">
            <input
              type="checkbox"
              name="confirm"
              className="mt-1 size-5 shrink-0 accent-primary"
            />
            <span>
              Saya telah meninjau isi berkas dan memastikan elemen serta
              pernyataan sesuai dokumen sumber.
            </span>
          </label>
        </fieldset>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <div className="dialog-actions">
          <Button
            variant="outline"
            disabled={busy || reading}
            onClick={onClose}
          >
            Batal
          </Button>
          <Button type="submit" disabled={busy || reading || !subjects}>
            {busy ? "Menerbitkan…" : "Terbitkan versi CP"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
