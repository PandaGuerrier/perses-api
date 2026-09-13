import School from '#schools/models/school'
import { UserFactory } from '#users/database/factories/user'
import { ALL_PERMISSIONS, PERMISSIONS, type Permission } from '#users/enums/permission'
import { ROLES, type Role as RoleSlug } from '#users/enums/role'
import Role from '#users/models/role'
import type User from '#users/models/user'

const P = PERMISSIONS

/** Mirrors app/users/database/seeders/user_seeder.ts. */
export const SYSTEM_ROLE_PERMISSIONS: Record<RoleSlug, Permission[]> = {
  [ROLES.SUPER_ADMIN]: ALL_PERMISSIONS,
  [ROLES.ADMIN]: [
    P.schoolsViewList,
    P.schoolsUpdate,
    P.schoolMembersViewList,
    P.schoolMembersInvite,
    P.schoolMembersRemove,
    P.schoolMembersManageRoles,
    P.usersViewList,
    P.usersUpdate,
    P.groupsViewList,
    P.groupsCreate,
    P.groupsUpdate,
    P.groupsDelete,
    P.groupsManageMembers,
    P.examsViewList,
    P.examsCreate,
    P.examsUpdate,
    P.examsDelete,
    P.rolesViewList,
    P.rolesCreate,
    P.rolesUpdate,
    P.rolesDelete,
    P.tokensViewList,
    P.tokensCreate,
    P.tokensDelete,
  ],
  [ROLES.TEACHER]: [
    P.groupsViewList,
    P.groupsCreate,
    P.groupsUpdate,
    P.groupsDelete,
    P.groupsManageMembers,
    P.schoolMembersViewList,
    P.examsViewList,
  ],
  [ROLES.STUDENT]: [P.examsViewSchedule],
}

// Call after `wrapInGlobalTransaction` — otherwise the seeded rows leak.
export async function ensureBaseRoles(): Promise<void> {
  for (const [name, permissions] of Object.entries(SYSTEM_ROLE_PERMISSIONS)) {
    const role = await Role.updateOrCreate(
      { name, schoolUuid: null },
      { name, schoolUuid: null, isSystem: true, permissions }
    )
    await role.syncPermissions(permissions)
  }
}

export async function systemRole(name: RoleSlug): Promise<Role> {
  return Role.query().where('name', name).whereNull('school_uuid').firstOrFail()
}

export async function systemRoleUuid(name: RoleSlug): Promise<string> {
  const role = await systemRole(name)
  return role.uuid
}

export async function withRole(user: User, roleName: RoleSlug): Promise<Role> {
  const role = await systemRole(roleName)
  await user.assignRole(role)
  return role
}

/** A school-scoped custom role, the way an admin would author one. */
export async function withCustomRole(
  user: User,
  name: string,
  permissions: Permission[],
  schoolUuid: string | null = user.schoolUuid
): Promise<Role> {
  const role = await Role.updateOrCreate(
    { name, schoolUuid },
    { name, schoolUuid, isSystem: false, permissions }
  )
  await role.syncPermissions(permissions)
  await user.assignRole(role)
  return role
}

export async function createSchool(name = 'Test school'): Promise<School> {
  const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).slice(2, 8)}`
  return School.create({ name, slug, description: null })
}

/** A user carrying a system role, optionally attached to a school. */
export async function makeUser(
  role: RoleSlug,
  school?: School | null,
  attributes: Partial<{ email: string; fullName: string }> = {}
): Promise<User> {
  const user = await UserFactory.merge({
    ...attributes,
    schoolUuid: school ? school.uuid : null,
  }).create()

  await withRole(user, role)

  return user
}
