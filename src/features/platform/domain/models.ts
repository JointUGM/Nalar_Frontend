import { z } from "zod";

const name = z.string().trim().min(2, "Isi setidaknya 2 karakter.").max(160);
const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Alamat email belum valid."));
export const schoolInputSchema = z.object({
  name,
  npsn: z.string().regex(/^\d{8}$/, "NPSN harus terdiri dari 8 angka."),
  admin_email: email,
});
export const replaceAdminSchema = z.object({ admin_email: email });
export const statusInputSchema = z.object({
  status: z.enum(["active", "suspended"]),
  reason: z
    .string()
    .trim()
    .min(10, "Tuliskan alasan setidaknya 10 karakter.")
    .max(1000),
});
export const schoolSchema = z.object({
  id: z.uuid(),
  name,
  npsn: z.string().regex(/^\d{8}$/),
  status: z.enum(["active", "suspended"]),
  admin: z.object({
    email,
    invitation_status: z.enum(["pending", "accepted"]),
  }),
  user_count: z.number().int().nonnegative(),
  created_at: z.iso.datetime({ offset: true }),
});
const outcomeSchema = z.object({
  element: name,
  description: z.string().trim().min(10).max(10000),
  statements: z.array(z.string().trim().min(10).max(5000)).min(1).max(100),
});
const subjectSchema = z.object({
  name,
  phase: z.enum(["A", "B", "C", "D", "E", "F"]),
  outcomes: z.array(outcomeSchema).min(1).max(100),
});
export const curriculumInputSchema = z
  .object({
    decree_code: z.string().trim().min(3).max(100),
    title: name,
    effective_on: z.iso.date(),
    subjects: z.array(subjectSchema).min(1).max(50),
  })
  .superRefine((input, context) => {
    const keys = input.subjects.map(
      (s) => `${s.name.toLowerCase()}:${s.phase}`,
    );
    if (new Set(keys).size !== keys.length)
      context.addIssue({
        code: "custom",
        path: ["subjects"],
        message: "Mata pelajaran dan fase tidak boleh duplikat.",
      });
  });
export const curriculumSchema = z.object({
  id: z.uuid(),
  decree_code: z.string(),
  title: z.string(),
  effective_on: z.iso.date(),
  status: z.enum(["draft", "published", "superseded"]),
  published_at: z.iso.datetime({ offset: true }).nullable(),
  mapped_school_count: z.number().int().nonnegative(),
  subjects: z.array(subjectSchema),
});
export const pageOf = <T extends z.ZodType>(schema: T) =>
  z.object({
    items: z.array(schema),
    next_cursor: z.string().nullable(),
  });
export type School = z.infer<typeof schoolSchema>;
export type SchoolInput = z.infer<typeof schoolInputSchema>;
export type StatusInput = z.infer<typeof statusInputSchema>;
export type Curriculum = z.infer<typeof curriculumSchema>;
export type CurriculumInput = z.infer<typeof curriculumInputSchema>;
export type Page<T> = { items: T[]; next_cursor: string | null };
