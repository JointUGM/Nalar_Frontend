export interface CurriculumCatalog {
  versions: readonly { id: string; name: string; published: string; schools: number; current: boolean }[]
  reference: { title: string; outcomes: readonly { concept: string; statement: string }[] } | null
}
