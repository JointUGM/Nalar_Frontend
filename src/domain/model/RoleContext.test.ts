import { describe, expect, it } from 'vitest'
import type { Identity } from './Identity'
import { getRoleChoices, resolveRoleDestination } from './RoleContext'

const identity: Identity = {
  userId: '00000000-0000-4000-8000-000000000001', fullName: 'Ayu',
  isPlatformAdmin: true, isParent: true,
  memberships: [
    { role: 'teacher', schoolId: '00000000-0000-4000-8000-000000000002', schoolName: 'Sekolah A' },
    { role: 'teacher', schoolId: '00000000-0000-4000-8000-000000000003', schoolName: 'Sekolah B' },
    { role: 'student', schoolId: '00000000-0000-4000-8000-000000000002', schoolName: 'Sekolah A' },
  ],
}

describe('server-authorized role context', () => {
  it('keeps each role and school membership distinct', () => {
    expect(getRoleChoices(identity).map((choice) => choice.path)).toEqual([
      '/platform', '/parent',
      '/teacher/00000000-0000-4000-8000-000000000002',
      '/teacher/00000000-0000-4000-8000-000000000003',
      '/student/00000000-0000-4000-8000-000000000002',
    ])
  })

  it('allows only fresh membership routes and their internal descendants', () => {
    expect(resolveRoleDestination(identity, '/teacher/00000000-0000-4000-8000-000000000003/classes')).toBe('/teacher/00000000-0000-4000-8000-000000000003/classes')
    expect(resolveRoleDestination(identity, '/platform/schools')).toBe('/platform/schools')
    expect(resolveRoleDestination(identity, '/school/00000000-0000-4000-8000-000000000002')).toBeNull()
    expect(resolveRoleDestination({ ...identity, isPlatformAdmin: false }, '/platform/schools')).toBeNull()
  })

  it.each(['/login', '//evil.test', 'https://evil.test', '/teacher/00000000-0000-4000-8000-000000000004', '/teacher/00000000-0000-4000-8000-000000000002%2fsecret', '/parent?next=//evil.test', '/platform//schools', '/platform/../parent'])('rejects unsafe or unrelated intent %s', (path) => {
    expect(resolveRoleDestination(identity, path)).toBeNull()
  })
})
