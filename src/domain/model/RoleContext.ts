import type { Identity } from './Identity'

export interface RoleChoice {
  readonly label: string
  readonly detail: string
  readonly path: string
}

const schoolRoles = {
  school_admin: { label: 'Admin Sekolah', route: 'school' },
  teacher: { label: 'Guru', route: 'teacher' },
  student: { label: 'Siswa', route: 'student' },
} as const

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function getRoleChoices(identity: Identity): RoleChoice[] {
  const choices: RoleChoice[] = []
  if (identity.isPlatformAdmin) choices.push({ label: 'Admin Platform', detail: 'NALAR', path: '/platform' })
  if (identity.isParent) choices.push({ label: 'Orang Tua', detail: 'Akun orang tua', path: '/parent' })
  for (const membership of identity.memberships) {
    const role = schoolRoles[membership.role]
    choices.push({ label: role.label, detail: membership.schoolName, path: `/${role.route}/${membership.schoolId}` })
  }
  return choices
}

// Role and school are selected by the internal path, then rechecked against
// the latest /me result before any protected page can render.
export function resolveRoleDestination(identity: Identity, path: unknown): string | null {
  if (typeof path !== 'string' || !/^\/[A-Za-z0-9_/-]+$/.test(path) || path.includes('//') || path.includes('/./') || path.includes('/../')) return null
  const segments = path.split('/').slice(1)
  const role = segments[0]
  if (role === 'platform' && identity.isPlatformAdmin) return path
  if (role === 'parent' && identity.isParent) return path
  if (role !== 'school' && role !== 'teacher' && role !== 'student') return null
  const schoolId = segments[1]
  if (!schoolId || !uuid.test(schoolId)) return null
  const membershipRole = role === 'school' ? 'school_admin' : role
  return identity.memberships.some((item) => item.role === membershipRole && item.schoolId.toLowerCase() === schoolId.toLowerCase()) ? path : null
}
