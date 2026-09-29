export interface School {
  id: string
  name: string
  npsn: string
  city: string
  admin: string
  users: number
  status: 'active' | 'invited' | 'suspended'
}

export interface PlatformOverview {
  schools: readonly School[]
  summary: { activeSchools: number | null; users: number | null; curriculum: string | null }
}
