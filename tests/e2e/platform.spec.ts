import { expect, test } from "@playwright/test";
import path from "node:path";

test.beforeEach(async ({ page }) => {
  await page.goto("/demo/platform/schools");
  await expect(
    page.getByRole("heading", { name: "Sekolah", exact: true }),
  ).toBeVisible();
});
test("school search and status filter", async ({ page }) => {
  await page.getByRole("textbox", { name: "Cari sekolah" }).fill("Sleman");
  await expect(
    page.getByRole("button", { name: "SMP Nalar Sleman", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "SMP Nalar Yogyakarta", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("textbox", { name: "Cari sekolah" }).fill("");
  await page.getByLabel("Filter status sekolah").selectOption("suspended");
  await expect(
    page.getByRole("button", { name: "SMP Nalar Semarang", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "SMP Nalar Sleman", exact: true }),
  ).toHaveCount(0);
});
test("registration validates, persists and refuses duplicate NPSN", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Daftarkan sekolah", exact: true })
    .click();
  await page.getByRole("button", { name: "Daftarkan & undang admin" }).click();
  await expect(page.getByRole("alert")).toContainText("Periksa");
  await page
    .getByLabel("Nama sekolah", { exact: true })
    .fill("SMP Pengujian Browser");
  await page.getByLabel("NPSN", { exact: true }).fill("90000100");
  await page.getByLabel("Email admin sekolah pertama").fill("new@example.com");
  await page.getByRole("button", { name: "Daftarkan & undang admin" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "SMP Pengujian Browser", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Daftarkan sekolah", exact: true })
    .click();
  await page.getByLabel("Nama sekolah", { exact: true }).fill("SMP Duplikat");
  await page.getByLabel("NPSN", { exact: true }).fill("90000100");
  await page
    .getByLabel("Email admin sekolah pertama")
    .fill("other@example.com");
  await page.getByRole("button", { name: "Daftarkan & undang admin" }).click();
  await expect(page.getByRole("alert")).toContainText("sudah terdaftar");
});
test("admin replacement and school suspension preserve metadata", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Kelola SMP Nalar Yogyakarta" })
    .click();
  await page.getByRole("button", { name: "Ganti admin", exact: true }).click();
  await page.getByLabel("Email admin baru").fill("replacement@example.com");
  await page.getByRole("button", { name: "Ganti & undang admin" }).click();
  await expect(
    page.getByText("replacement@example.com", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Kelola SMP Nalar Yogyakarta" })
    .click();
  await page
    .getByRole("button", { name: "Tangguhkan sekolah", exact: true })
    .click();
  await page.getByLabel("Alasan perubahan").fill("Pengujian penangguhan akses");
  await page
    .getByRole("button", { name: "Tangguhkan sekolah", exact: true })
    .click();
  const row = page.getByRole("row").filter({ hasText: "SMP Nalar Yogyakarta" });
  await expect(row).toContainText("Ditangguhkan");
  await expect(row).toContainText("128");
  await page
    .getByRole("button", { name: "Kelola SMP Nalar Yogyakarta" })
    .click();
  await page
    .getByRole("button", { name: "Aktifkan sekolah", exact: true })
    .click();
  await page.getByLabel("Alasan perubahan").fill("Pengujian aktivasi kembali");
  await page
    .getByRole("button", { name: "Aktifkan sekolah", exact: true })
    .click();
  await expect(row).toContainText("Diundang · aktif");
});
test("CP publishing validates JSON and keeps the earlier school mappings", async ({
  page,
}) => {
  await page
    .getByRole("link", { name: "Capaian Pembelajaran", exact: true })
    .click();
  await page.getByRole("button", { name: "Terbitkan versi baru" }).click();
  await page.getByLabel("Nomor keputusan").fill("001/TEST/2026");
  await page.getByLabel("Judul versi").fill("Kurikulum pengujian");
  await page.getByLabel("Tanggal berlaku").fill("2026-09-28");
  await page.getByLabel("Unggah berkas kurikulum JSON").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from("[{}]"),
  });
  await expect(page.getByRole("alert")).toContainText("belum sesuai");
  await page
    .getByLabel("Unggah berkas kurikulum JSON")
    .setInputFiles(path.join(process.cwd(), "public/cp-example.json"));
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "Terbitkan versi CP", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "001/TEST/2026", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: /046\/H\/KR\/2025/ }).click();
  await expect(
    page.getByText("3 sekolah memetakan", { exact: true }),
  ).toBeVisible();
});
test("dialog keyboard navigation traps and restores focus", async ({
  page,
}) => {
  const trigger = page.getByRole("button", {
    name: "Daftarkan sekolah",
    exact: true,
  });
  await trigger.click();
  await expect(page.getByLabel("Nama sekolah", { exact: true })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Tutup formulir" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
test("mobile navigation and layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Buka navigasi" }).click();
  await page
    .getByRole("link", { name: "Capaian Pembelajaran", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Capaian Pembelajaran", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
