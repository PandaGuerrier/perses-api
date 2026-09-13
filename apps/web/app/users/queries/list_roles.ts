import Role from '#users/models/role'
import { PERMISSIONS } from '#users/enums/permission'
import { ROLES } from '#users/enums/role'
import type User from '#users/models/user'

export interface ListRolesInput {
  viewer: User
}

/**
 * The built-in roles plus the custom ones of the viewer's own school. A
 * super-admin sees every school's, and only they ever see `super_admin`.
 */
export default class ListRoles {
  async handle({ viewer }: ListRolesInput): Promise<Role[]> {
    const query = Role.query().orderBy('is_system', 'desc').orderBy('name', 'asc')

    if (await viewer.hasPermission(PERMISSIONS.schoolsViewAny)) return query

    return query
      .where((sub) => {
        sub.whereNull('school_uuid')
        if (viewer.schoolUuid) sub.orWhere('school_uuid', viewer.schoolUuid)
      })
      .whereNot('name', ROLES.SUPER_ADMIN)
  }
}
