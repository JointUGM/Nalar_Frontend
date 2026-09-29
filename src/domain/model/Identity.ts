export type SchoolRole = 'school_admin' | 'teacher' | 'student'

export interface SchoolMembership {
  readonly role: SchoolRole
  readonly schoolId: string
  readonly schoolName: string
}

export interface Identity {
  readonly userId: string
  readonly fullName: string
  readonly memberships: readonly SchoolMembership[]
  readonly isParent: boolean
  readonly isPlatformAdmin: boolean
}
