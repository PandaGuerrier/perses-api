import { PERMISSIONS } from '#users/enums/permission'
import type User from '#users/models/user'

/**
 * The shared-props projection of the permission catalogue. `CanKey` in
 * #common/ui/types/navigation is `keyof GlobalPermissions`, so adding an entry
 * here is what makes a nav item gateable — and what reshapes the dashboard.
 */
export type GlobalPermissions = {
  manageSchools: boolean
  manageMembers: boolean
  manageGroups: boolean
  manageExams: boolean
  manageRoles: boolean
  manageUsers: boolean
  manageTokens: boolean
  viewSchedule: boolean
}

export const EMPTY_GLOBAL_PERMISSIONS: GlobalPermissions = {
  manageSchools: false,
  manageMembers: false,
  manageGroups: false,
  manageExams: false,
  manageRoles: false,
  manageUsers: false,
  manageTokens: false,
  viewSchedule: false,
}

export async function globalPermissions(user: User | undefined): Promise<GlobalPermissions> {
  if (!user) return EMPTY_GLOBAL_PERMISSIONS

  const held = new Set(await user.getPermissions())

  return {
    manageSchools: held.has(PERMISSIONS.schoolsViewList),
    manageMembers: held.has(PERMISSIONS.schoolMembersViewList),
    manageGroups: held.has(PERMISSIONS.groupsViewList),
    manageExams: held.has(PERMISSIONS.examsViewList),
    manageRoles: held.has(PERMISSIONS.rolesViewList),
    manageUsers: held.has(PERMISSIONS.usersViewList),
    manageTokens: held.has(PERMISSIONS.tokensViewList),
    viewSchedule: held.has(PERMISSIONS.examsViewSchedule),
  }
}
