import type { PlatformRepository } from "./repository";
import {
  curriculumInputSchema,
  replaceAdminSchema,
  schoolInputSchema,
  statusInputSchema,
} from "../domain/models";

export class PlatformService {
  constructor(private readonly repository: PlatformRepository) {}
  listSchools(cursor?: string) {
    return this.repository.listSchools(cursor);
  }
  listCurricula(cursor?: string) {
    return this.repository.listCurricula(cursor);
  }
  createSchool(input: unknown, key: string) {
    return this.repository.createSchool(schoolInputSchema.parse(input), key);
  }
  replaceAdmin(id: string, input: unknown, key: string) {
    return this.repository.replaceAdmin(
      id,
      replaceAdminSchema.parse(input).admin_email,
      key,
    );
  }
  changeSchoolStatus(id: string, input: unknown, key: string) {
    return this.repository.changeSchoolStatus(
      id,
      statusInputSchema.parse(input),
      key,
    );
  }
  publishCurriculum(input: unknown, key: string) {
    return this.repository.publishCurriculum(
      curriculumInputSchema.parse(input),
      key,
    );
  }
}
