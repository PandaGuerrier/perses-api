export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

const ROLE_WEIGHTS: Record<Role, number> = {
  super_admin: 40,
  admin: 30,
  teacher: 20,
  student: 10,
}

const KNOWN_ROLES = new Set<string>(Object.values(ROLES))

function isKnownRole(role: string): role is Role {
  return KNOWN_ROLES.has(role)
}

/**
 * A user carries several roles (a system one plus any school-scoped custom
 * ones). `mainRole` picks the one to display; custom roles are unknown here
 * and are ignored on purpose.
 */
export function mainRole(roles: string[]): Role | null {
  const known = roles.filter(isKnownRole)
  if (known.length === 0) return null
  return known.reduce((top, role) => (ROLE_WEIGHTS[role] > ROLE_WEIGHTS[top] ? role : top))
}
