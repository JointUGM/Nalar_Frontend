const schoolScoped = new Set(['teacher', 'student', 'school'])

/** The access context a path belongs to: the role, plus the school for school-scoped roles. */
export function accessContext(pathname: string): string {
  const [role = '', school = ''] = pathname.split('/').filter(Boolean)
  return schoolScoped.has(role) ? `${role}/${school}` : role
}
