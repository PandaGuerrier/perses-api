import { PERMISSIONS } from '#users/enums/permission'
import type User from '#users/models/user'

/**
 * Every school-scoped policy reads the same way: hold the capability, then
 * either hold the platform-wide escape hatch or belong to the resource's
 * school. Keeping it in one place means a new module cannot quietly invent a
 * looser rule.
 */
export function sameSchool(currentUser: User, schoolUuid: string | null): boolean {
  return currentUser.schoolUuid !== null && currentUser.schoolUuid === schoolUuid
}

export async function canReachAnySchool(currentUser: User): Promise<boolean> {
  return currentUser.hasPermission(PERMISSIONS.schoolsViewAny)
}

export async function scopedTo(currentUser: User, schoolUuid: string | null): Promise<boolean> {
  if (await canReachAnySchool(currentUser)) return true
  return sameSchool(currentUser, schoolUuid)
}
