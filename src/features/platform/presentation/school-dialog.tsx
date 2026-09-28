"use client";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Building2, Mail, ShieldCheck } from "lucide-react";
import { usePlatform } from "@/composition/platform-provider";
import { Dialog } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import {
  schoolInputSchema,
  replaceAdminSchema,
  statusInputSchema,
  type School,
} from "../domain/models";
import { errorMessage } from "../domain/errors";

export type SchoolAction =
  { kind: "create" } | { kind: "admin" | "status"; school: School };
export function SchoolDialog({
  action,
  onClose,
  onSaved,
}: {
  action: SchoolAction;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const { service, demo } = usePlatform();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [submission, setSubmission] = useState<{
    payload: string;
    key: string;
  } | null>(null);
  const school = action.kind === "create" ? null : action.school;
  const suspending = school?.status === "active";
  const title =
    action.kind === "create"
      ? "Daftarkan sekolah"
      : action.kind === "admin"
        ? "Ganti admin sekolah"
        : suspending
          ? "Tangguhkan sekolah?"
          : "Aktifkan kembali sekolah?";
  const description =
    action.kind === "create"
      ? "Tambahkan sekolah dan undang admin pertamanya untuk menyiapkan ruang belajar."
      : action.kind === "admin"
        ? `Ganti pengelola ${school?.name}. Akses admin sebelumnya akan dicabut; peran lainnya tetap tersimpan.`
        : suspending
          ? `Akses sekolah ${school?.name} akan ditangguhkan. Data dan riwayat tetap tersimpan.`
          : `${school?.name} dapat kembali mengakses platform. Riwayat sebelumnya tetap tersimpan.`;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const input =
      action.kind === "status"
        ? { status: suspending ? "suspended" : "active", reason: data.reason }
        : data;
    const schema =
      action.kind === "create"
        ? schoolInputSchema
        : action.kind === "admin"
          ? replaceAdminSchema
          : statusInputSchema;
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
      setFields(
        Object.fromEntries(
          parsed.error.issues.map((i) => [String(i.path[0]), i.message]),
        ),
      );
      setError("Periksa kembali isian formulir.");
      return;
    }
    const payload = JSON.stringify(parsed.data);
    const key =
      submission?.payload === payload ? submission.key : crypto.randomUUID();
    setSubmission({ payload, key });
    setFields({});
    setError(null);
    setBusy(true);
    try {
      if (action.kind === "create")
        await service.createSchool(parsed.data, key);
      else if (action.kind === "admin")
        await service.replaceAdmin(action.school.id, parsed.data, key);
      else await service.changeSchoolStatus(action.school.id, parsed.data, key);
      onSaved(
        demo
          ? "Perubahan demo tersimpan di browser ini."
          : action.kind === "status"
            ? "Status sekolah diperbarui."
            : "Data tersimpan dan undangan admin telah dijadwalkan.",
      );
    } catch (e) {
      setError(
        e instanceof z.ZodError ? "Periksa isian formulir." : errorMessage(e),
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
      title={title}
      description={description}
    >
      <form onSubmit={submit} noValidate className="mt-6 space-y-5">
        <fieldset disabled={busy} className="space-y-5">
          {action.kind === "create" && (
            <>
              <Field
                id="school-name"
                name="name"
                label="Nama sekolah"
                placeholder="Contoh: SMP Negeri 1 Yogyakarta"
                autoComplete="organization"
                required
                error={fields.name}
              />
              <Field
                id="school-npsn"
                name="npsn"
                label="NPSN"
                placeholder="8 angka nomor sekolah"
                inputMode="numeric"
                maxLength={8}
                required
                hint="Nomor Pokok Sekolah Nasional, unik untuk setiap sekolah."
                error={fields.npsn}
              />
            </>
          )}
          {action.kind !== "status" ? (
            <>
              <Field
                id="admin-email"
                name="admin_email"
                label={
                  action.kind === "create"
                    ? "Email admin sekolah pertama"
                    : "Email admin baru"
                }
                type="email"
                placeholder="admin@sekolah.sch.id"
                autoComplete="email"
                required
                error={fields.admin_email}
              />
              <div className="info-box">
                <Mail size={18} />
                <p>
                  {demo
                    ? "Demo menyimpan status undangan. Tidak ada email yang dikirim."
                    : "Admin akan menerima tautan aktivasi melalui email untuk mengatur kata sandinya sendiri."}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="info-box">
                <Building2 size={18} />
                <p>
                  <strong>{school?.name}</strong>
                  <br />
                  NPSN {school?.npsn}
                </p>
              </div>
              <div className="field">
                <label htmlFor="status-reason">Alasan perubahan</label>
                <textarea
                  id="status-reason"
                  name="reason"
                  required
                  minLength={10}
                  maxLength={1000}
                  rows={3}
                  placeholder="Tuliskan alasan untuk catatan audit…"
                  aria-invalid={Boolean(fields.reason)}
                  aria-describedby={fields.reason ? "reason-error" : undefined}
                />
                {fields.reason && (
                  <p id="reason-error" className="text-danger">
                    {fields.reason}
                  </p>
                )}
              </div>
              <p className="flex gap-2 text-xs text-muted-foreground">
                <ShieldCheck size={16} className="shrink-0" />
                Perubahan dapat dibalik dengan mengaktifkan atau menangguhkan
                sekolah kembali.
              </p>
            </>
          )}
        </fieldset>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <div className="dialog-actions">
          <Button variant="outline" disabled={busy} onClick={onClose}>
            Batal
          </Button>
          <Button
            type="submit"
            variant={
              action.kind === "status" && suspending ? "danger" : "default"
            }
            disabled={busy}
          >
            {busy
              ? "Menyimpan…"
              : action.kind === "create"
                ? "Daftarkan & undang admin"
                : action.kind === "admin"
                  ? "Ganti & undang admin"
                  : suspending
                    ? "Tangguhkan sekolah"
                    : "Aktifkan sekolah"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
