import { describe, expect, it } from "vitest";
import { PlatformService } from "../../src/features/platform/application/platform-service";
import { DemoPlatformRepository } from "../../src/features/platform/infrastructure/demo-platform-repository";
import {
  curriculumInputSchema,
  curriculumSchema,
  schoolSchema,
} from "../../src/features/platform/domain/models";

const school = {
  name: "SMP Pengujian",
  npsn: "90000100",
  admin_email: "operator@example.com",
};
const cp = {
  decree_code: "001/TEST/2026",
  title: "Kurikulum pengujian",
  effective_on: "2026-09-28",
  subjects: [
    {
      name: "IPA",
      phase: "D",
      outcomes: [
        {
          element: "Gaya dan gerak",
          description: "Contoh deskripsi elemen pembelajaran.",
          statements: ["Contoh pernyataan capaian pembelajaran."],
        },
      ],
    },
  ],
};
function setup() {
  const repository = new DemoPlatformRepository();
  return { repository, service: new PlatformService(repository) };
}
describe("platform use cases", () => {
  it("accepts database CP states and timezone-aware timestamps while stripping assessment fields", async () => {
    const { service } = setup();
    const version = (await service.listCurricula()).items[0];
    expect(
      curriculumSchema.parse({
        ...version,
        status: "superseded",
        published_at: "2026-09-28T09:00:00+07:00",
      }).status,
    ).toBe("superseded");
    const school = (await service.listSchools()).items[0];
    const safe = schoolSchema.parse({
      ...school,
      created_at: "2026-09-28T09:00:00+07:00",
      transcripts: ["private"],
      admin: { ...school.admin, student_scores: [4] },
    });
    expect(safe).not.toHaveProperty("transcripts");
    expect(safe.admin).not.toHaveProperty("student_scores");
  });
  it("refuses invalid NPSN without creating a school", async () => {
    const { service } = setup();
    const before = await service.listSchools();
    expect(() =>
      service.createSchool({ ...school, npsn: "12" }, "one"),
    ).toThrow();
    expect((await service.listSchools()).items).toEqual(before.items);
  });
  it("normalizes input and replays a retried registration once", async () => {
    const { service } = setup();
    const created = await service.createSchool(
      {
        ...school,
        name: " SMP Pengujian ",
        admin_email: "OPERATOR@EXAMPLE.COM",
      },
      "one",
    );
    expect(created.name).toBe("SMP Pengujian");
    expect(created.admin.email).toBe("operator@example.com");
    expect(await service.createSchool(school, "one")).toEqual(created);
    expect(
      (await service.listSchools()).items.filter((s) => s.npsn === school.npsn),
    ).toHaveLength(1);
  });
  it("refuses duplicate NPSN and changed payloads under the same key", async () => {
    const { service } = setup();
    await service.createSchool(school, "one");
    await expect(service.createSchool(school, "two")).rejects.toMatchObject({
      code: "NPSN_ALREADY_EXISTS",
    });
    await expect(
      service.createSchool({ ...school, name: "Another school" }, "one"),
    ).rejects.toMatchObject({ code: "IDEMPOTENCY_KEY_REUSED" });
  });
  it("replays commands after reopening persisted demo state", async () => {
    const saved = new Map<string, string>();
    const storage = {
      getItem: (key: string) => saved.get(key) ?? null,
      setItem: (key: string, value: string) => {
        saved.set(key, value);
      },
    };
    const first = new PlatformService(new DemoPlatformRepository(storage));
    const created = await first.createSchool(school, "one");
    const second = new PlatformService(new DemoPlatformRepository(storage));
    expect(await second.createSchool(school, "one")).toEqual(created);
  });
  it("replaces the administrator without changing counts or school status", async () => {
    const { service } = setup();
    const original = (await service.listSchools()).items[0];
    const updated = await service.replaceAdmin(
      original.id,
      { admin_email: "new@example.com" },
      "replace",
    );
    expect(updated.admin).toEqual({
      email: "new@example.com",
      invitation_status: "pending",
    });
    expect(updated.user_count).toBe(original.user_count);
    expect(updated.status).toBe(original.status);
  });
  it("requires a reason and preserves metadata through suspension and reactivation", async () => {
    const { service } = setup();
    const original = (await service.listSchools()).items[0];
    expect(() =>
      service.changeSchoolStatus(
        original.id,
        { status: "suspended", reason: " " },
        "bad",
      ),
    ).toThrow();
    await service.changeSchoolStatus(
      original.id,
      { status: "suspended", reason: "Pengujian akses sekolah" },
      "suspend",
    );
    const restored = await service.changeSchoolStatus(
      original.id,
      { status: "active", reason: "Pengujian akses selesai" },
      "restore",
    );
    expect(restored).toEqual(original);
  });
  it("publishes a new CP version without touching prior contents or mappings", async () => {
    const { service } = setup();
    const before = (await service.listCurricula()).items;
    const created = await service.publishCurriculum(cp, "cp-one");
    expect(created.mapped_school_count).toBe(0);
    expect(created.status).toBe("published");
    expect((await service.listCurricula()).items.slice(1)).toEqual(before);
    expect(await service.publishCurriculum(cp, "cp-one")).toEqual(created);
    await expect(service.publishCurriculum(cp, "cp-two")).rejects.toMatchObject(
      { code: "CP_VERSION_ALREADY_EXISTS" },
    );
  });
  it("requires statement-level CP content and unique subject/phase pairs", () => {
    expect(
      curriculumInputSchema.safeParse({ ...cp, subjects: [] }).success,
    ).toBe(false);
    expect(
      curriculumInputSchema.safeParse({
        ...cp,
        subjects: [cp.subjects[0], cp.subjects[0]],
      }).success,
    ).toBe(false);
    expect(
      curriculumInputSchema.safeParse({
        ...cp,
        subjects: [
          {
            ...cp.subjects[0],
            outcomes: [{ ...cp.subjects[0].outcomes[0], statements: [] }],
          },
        ],
      }).success,
    ).toBe(false);
  });
  it("does not report saved changes when browser storage fails", async () => {
    const repository = new DemoPlatformRepository({
      getItem: () => null,
      setItem: () => {
        throw new Error("storage full");
      },
    });
    await expect(repository.createSchool(school, "one")).rejects.toMatchObject({
      code: "DEMO_STORAGE_UNAVAILABLE",
    });
    expect(
      (await repository.listSchools()).items.some(
        (s) => s.npsn === school.npsn,
      ),
    ).toBe(false);
  });
});
