import AdminLockoutException from '#users/exceptions/admin_lockout'
import ManageRolesUnauthorizedException from '#users/exceptions/manage_roles_unauthorized'
import PermissionEscalationException from '#users/exceptions/permission_escalation'
import { PERMISSIONS, type Permission } from '#users/enums/permission'
import { ROLES } from '#users/enums/role'
import Role from '#users/models/role'
import type User from '#users/models/user'

const LOCKED_ROLES: string[] = [ROLES.SUPER_ADMIN, ROLES.ADMIN]

export async function requireManageRoles(executor: User) {
  const allowed = await executor.hasPermission(PERMISSIONS.schoolMembersManageRoles)
  if (!allowed) throw new ManageRolesUnauthorizedException()
}

/**
 * A role is only a bundle of permissions, so "escalation" is granting a
 * permission the executor does not hold. This is the single guard behind both
 * assigning a role and authoring a custom one.
 */
export async function assertGrantablePermissions(executor: User, permissions: Permission[]) {
  const held = new Set<Permission>(await executor.getPermissions())
  const escalating = [...new Set(permissions)].filter((permission) => !held.has(permission))
  if (escalating.length > 0) throw new PermissionEscalationException(escalating)
}

/**
 * Roles an executor may hand out: the built-in ones plus the custom roles of
 * their own school. A super-admin sees every school's.
 */
export async function grantableRoles(executor: User): Promise<Role[]> {
  const query = Role.query()

  if (await executor.hasPermission(PERMISSIONS.schoolsViewAny)) return query.orderBy('name', 'asc')

  return query
    .where((sub) => {
      sub.whereNull('school_uuid')
      if (executor.schoolUuid) sub.orWhere('school_uuid', executor.schoolUuid)
    })
    .whereNot('name', ROLES.SUPER_ADMIN)
    .orderBy('name', 'asc')
}

export interface SyncUserRolesInput {
  target: User
  desiredRoleUuids: string[]
  executor: User
}

export default class SyncUserRoles {
  async handle({ target, desiredRoleUuids, executor }: SyncUserRolesInput): Promise<void> {
    await requireManageRoles(executor)

    const allowed = await grantableRoles(executor)
    const roles = allowed.filter((role) => desiredRoleUuids.includes(role.uuid))

    if (roles.length !== desiredRoleUuids.length) throw new ManageRolesUnauthorizedException()

    const currentNames = await target.getRoleNames()
    const desiredNames = roles.map((role) => role.name)

    const droppingOwnAdmin =
      target.uuid === executor.uuid &&
      currentNames.some((name) => LOCKED_ROLES.includes(name) && !desiredNames.includes(name))
    if (droppingOwnAdmin) throw new AdminLockoutException()

    await target.syncRoles(roles)
  }
}
