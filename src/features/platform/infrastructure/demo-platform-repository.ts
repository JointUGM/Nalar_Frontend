import { z } from "zod";
import type { PlatformRepository } from "../application/repository";
import {
  curriculumSchema,
  schoolSchema,
  type Curriculum,
  type CurriculumInput,
  type School,
  type SchoolInput,
  type StatusInput,
} from "../domain/models";
import { PlatformError } from "../domain/errors";

export const DEMO_STORAGE_KEY = "nalar.platform.demo.v1";
type StoragePort = Pick<Storage, "getItem" | "setItem">;
const stateSchema = z.object({
  schools: z.array(schoolSchema),
  curricula: z.array(curriculumSchema),
  receipts: z.record(
    z.string(),
    z.object({
      fingerprint: z.string(),
      result: z.union([schoolSchema, curriculumSchema]),
    }),
  ),
});
type DemoState = z.infer<typeof stateSchema>;
const seed: DemoState = {
  schools: [
    {
      id: "11111111-1111-4111-8111-111111111111",
      name: "SMP Nalar Yogyakarta",
      npsn: "90000001",
      status: "active",
      admin: {
        email: "admin.yogyakarta@example.com",
        invitation_status: "accepted",
      },
      user_count: 128,
      created_at: "2026-09-01T02:00:00Z",
    },
    {
      id: "22222222-2222-4222-8222-222222222222",
      name: "SMP Nalar Sleman",
      npsn: "90000002",
      status: "active",
      admin: {
        email: "admin.sleman@example.com",
        invitation_status: "accepted",
      },
      user_count: 96,
      created_at: "2026-09-10T02:00:00Z",
    },
    {
      id: "33333333-3333-4333-8333-333333333333",
      name: "SMP Nalar Bantul",
      npsn: "90000003",
      status: "active",
      admin: {
        email: "admin.bantul@example.com",
        invitation_status: "pending",
      },
      user_count: 0,
      created_at: "2026-09-20T02:00:00Z",
    },
    {
      id: "44444444-4444-4444-8444-444444444444",
      name: "SMP Nalar Semarang",
      npsn: "90000004",
      status: "suspended",
      admin: {
        email: "admin.semarang@example.com",
        invitation_status: "accepted",
      },
      user_count: 84,
      created_at: "2026-09-05T02:00:00Z",
    },
  ],
  curricula: [
    {
      id: "55555555-5555-4555-8555-555555555555",
      decree_code: "046/H/KR/2025",
      title: "Capaian Pembelajaran — contoh referensi",
      effective_on: "2025-01-01",
      status: "published",
      published_at: "2026-09-01T02:00:00Z",
      mapped_school_count: 3,
      subjects: [
        {
          name: "Ilmu Pengetahuan Alam",
          phase: "D",
          outcomes: [
            {
              element: "Pemahaman IPA",
              description:
                "Contoh data: memahami pengaruh gaya terhadap gerak benda dalam kehidupan sehari-hari.",
              statements: [
                "Contoh data: menjelaskan pengaruh gaya terhadap perubahan gerak benda.",
                "Contoh data: membandingkan gerak benda pada permukaan yang berbeda.",
              ],
            },
          ],
        },
      ],
    },
  ],
  receipts: {},
};

// This adapter is wired exclusively by the development-only /demo routes.
export class DemoPlatformRepository implements PlatformRepository {
  private state: DemoState;
  constructor(private readonly storage?: StoragePort) {
    this.state = structuredClone(seed);
    try {
      const saved = storage?.getItem(DEMO_STORAGE_KEY);
      if (saved) {
        const parsed = stateSchema.safeParse(JSON.parse(saved));
        if (parsed.success) this.state = parsed.data;
      }
    } catch {
      /* Invalid saved demo data starts from a clean fixture. */
    }
  }
  async listSchools() {
    return { items: structuredClone(this.state.schools), next_cursor: null };
  }
  async listCurricula() {
    return { items: structuredClone(this.state.curricula), next_cursor: null };
  }
  private mutate<T extends School | Curriculum>(
    key: string,
    fingerprint: string,
    change: (state: DemoState) => T,
  ): T {
    const receipt = this.state.receipts[key];
    if (receipt) {
      if (receipt.fingerprint !== fingerprint)
        throw new PlatformError(
          "IDEMPOTENCY_KEY_REUSED",
          "Permintaan ini berubah. Tutup formulir lalu buka kembali.",
        );
      return structuredClone(receipt.result) as T;
    }
    const next = structuredClone(this.state);
    const result = change(next);
    next.receipts[key] = { fingerprint, result: structuredClone(result) };
    try {
      this.storage?.setItem(DEMO_STORAGE_KEY, JSON.stringify(next));
    } catch {
      throw new PlatformError(
        "DEMO_STORAGE_UNAVAILABLE",
        "Penyimpanan demo tidak tersedia. Izinkan penyimpanan browser lalu coba lagi.",
      );
    }
    this.state = next;
    return structuredClone(result);
  }
  async createSchool(input: SchoolInput, key: string) {
    return this.mutate(key, JSON.stringify(["create", input]), (state) => {
      if (state.schools.some((s) => s.npsn === input.npsn))
        throw new PlatformError(
          "NPSN_ALREADY_EXISTS",
          "NPSN ini sudah terdaftar. Periksa daftar sekolah.",
        );
      const school: School = {
        id: crypto.randomUUID(),
        name: input.name,
        npsn: input.npsn,
        status: "active",
        admin: { email: input.admin_email, invitation_status: "pending" },
        user_count: 0,
        created_at: new Date().toISOString(),
      };
      state.schools.unshift(school);
      return school;
    });
  }
  async replaceAdmin(id: string, email: string, key: string) {
    return this.mutate(key, JSON.stringify(["admin", id, email]), (state) => {
      const school = this.find(state, id);
      if (school.admin.email === email)
        throw new PlatformError(
          "ADMIN_UNCHANGED",
          "Email ini sudah menjadi admin sekolah.",
        );
      school.admin = { email, invitation_status: "pending" };
      return school;
    });
  }
  async changeSchoolStatus(id: string, input: StatusInput, key: string) {
    return this.mutate(key, JSON.stringify(["status", id, input]), (state) => {
      const school = this.find(state, id);
      school.status = input.status;
      return school;
    });
  }
  async publishCurriculum(input: CurriculumInput, key: string) {
    return this.mutate(key, JSON.stringify(["cp", input]), (state) => {
      if (state.curricula.some((v) => v.decree_code === input.decree_code))
        throw new PlatformError(
          "CP_VERSION_ALREADY_EXISTS",
          "Nomor keputusan ini sudah terdaftar. Gunakan versi baru.",
        );
      const version: Curriculum = {
        ...input,
        id: crypto.randomUUID(),
        status: "published",
        published_at: new Date().toISOString(),
        mapped_school_count: 0,
      };
      state.curricula.unshift(version);
      return version;
    });
  }
  private find(state: DemoState, id: string) {
    const school = state.schools.find((s) => s.id === id);
    if (!school)
      throw new PlatformError("SCHOOL_NOT_FOUND", "Sekolah tidak ditemukan.");
    return school;
  }
}
