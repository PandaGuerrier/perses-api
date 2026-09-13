/**
 * Single catalogue for the whole app — every module adds its entries here
 * rather than forking a second const. Naming is `<subject>.<action>`.
 *
 * Roles are nothing but bundles of these: no policy ever tests a role name,
 * which is what lets a school admin grant `exams.create` to a teacher without
 * touching the global `teacher` role.
 */
export const PERMISSIONS = {
  // Platform-wide. `*.view_any` lifts the school scoping enforced everywhere
  // else, and is held by the super-admin alone.
  schoolsViewAny: 'schools.view_any',
  schoolsViewList: 'schools.view_list',
  schoolsCreate: 'schools.create',
  schoolsUpdate: 'schools.update',
  schoolsDelete: 'schools.delete',

  usersViewAny: 'users.view_any',
  usersViewList: 'users.view_list',
  usersUpdate: 'users.update',
  usersDelete: 'users.delete',

  // Membership of a school.
  schoolMembersViewList: 'school_members.view_list',
  schoolMembersInvite: 'school_members.invite',
  schoolMembersRemove: 'school_members.remove',
  schoolMembersManageRoles: 'school_members.manage_roles',

  groupsViewList: 'groups.view_list',
  groupsCreate: 'groups.create',
  groupsUpdate: 'groups.update',
  groupsDelete: 'groups.delete',
  groupsManageMembers: 'groups.manage_members',

  examsViewList: 'exams.view_list',
  examsCreate: 'exams.create',
  examsUpdate: 'exams.update',
  examsDelete: 'exams.delete',
  examsViewSchedule: 'exams.view_schedule',

  rolesViewList: 'roles.view_list',
  rolesCreate: 'roles.create',
  rolesUpdate: 'roles.update',
  rolesDelete: 'roles.delete',

  tokensViewList: 'tokens.view_list',
  tokensCreate: 'tokens.create',
  tokensDelete: 'tokens.delete',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

const PERMISSION_VALUES = new Set<string>(Object.values(PERMISSIONS))

export function isPermission(value: string): value is Permission {
  return PERMISSION_VALUES.has(value)
}

export const ALL_PERMISSIONS = Object.values(PERMISSIONS) as Permission[]
