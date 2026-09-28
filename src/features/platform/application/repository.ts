import type {
  Curriculum,
  CurriculumInput,
  Page,
  School,
  SchoolInput,
  StatusInput,
} from "../domain/models";

export interface PlatformRepository {
  listSchools(cursor?: string): Promise<Page<School>>;
  createSchool(input: SchoolInput, key: string): Promise<School>;
  replaceAdmin(id: string, email: string, key: string): Promise<School>;
  changeSchoolStatus(
    id: string,
    input: StatusInput,
    key: string,
  ): Promise<School>;
  listCurricula(cursor?: string): Promise<Page<Curriculum>>;
  publishCurriculum(input: CurriculumInput, key: string): Promise<Curriculum>;
}
