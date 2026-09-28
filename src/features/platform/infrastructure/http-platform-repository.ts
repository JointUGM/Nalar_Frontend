import type { PlatformRepository } from "../application/repository";
import {
  curriculumSchema,
  pageOf,
  schoolSchema,
  type CurriculumInput,
  type SchoolInput,
  type StatusInput,
} from "../domain/models";
import type { ApiClient } from "@/shared/http/api-client";

export class HttpPlatformRepository implements PlatformRepository {
  constructor(private readonly api: ApiClient) {}
  listSchools(cursor?: string) {
    return this.api.request(
      `/platform/schools?limit=20${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
      pageOf(schoolSchema),
    );
  }
  createSchool(input: SchoolInput, key: string) {
    return this.api.request("/platform/schools", schoolSchema, {
      method: "POST",
      body: input,
      key,
    });
  }
  replaceAdmin(id: string, admin_email: string, key: string) {
    return this.api.request(`/platform/schools/${id}/admin`, schoolSchema, {
      method: "PUT",
      body: { admin_email },
      key,
    });
  }
  changeSchoolStatus(id: string, input: StatusInput, key: string) {
    return this.api.request(`/platform/schools/${id}/status`, schoolSchema, {
      method: "PATCH",
      body: input,
      key,
    });
  }
  listCurricula(cursor?: string) {
    return this.api.request(
      `/platform/cp-versions?limit=20${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
      pageOf(curriculumSchema),
    );
  }
  publishCurriculum(input: CurriculumInput, key: string) {
    return this.api.request("/platform/cp-versions", curriculumSchema, {
      method: "POST",
      body: input,
      key,
    });
  }
}
