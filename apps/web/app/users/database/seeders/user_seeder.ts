import { BaseSeeder } from '@adonisjs/lucid/seeders'

import env from '#start/env'
import { ALL_PERMISSIONS, PERMISSIONS, type Permission } from '#users/enums/permission'
import { ROLES, type Role as RoleSlug } from '#users/enums/role'
import Role from '#users/models/role'
import User from '#users/models/user'

const P = PERMISSIONS

/**
 * The four built-in roles. They are only starting bundles: a school admin
 * widens what their teachers can do by authoring a custom role, never by
 * editing these.
 */
const SYSTEM_ROLES: Record<RoleSlug, Permission[]> = {
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

  // Deliberately without exams.create — an admin grants it via a custom role.
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

export default class UserSeeder extends BaseSeeder {
  async run() {
    const roles = new Map<string, Role>()

    for (const [name, permissions] of Object.entries(SYSTEM_ROLES)) {
      const role = await Role.updateOrCreate(
        { name, schoolUuid: null },
        { name, schoolUuid: null, isSystem: true, permissions }
      )
      // updateOrCreate skips the jsonb column when the row already existed.
      await role.syncPermissions(permissions)
      roles.set(name, role)
    }

    // Promotion to super-admin happens here and nowhere else — no screen offers it.
    const emails = env
      .get('SUPER_ADMIN_EMAILS', '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)

    for (const email of emails) {
      const user = await User.updateOrCreate({ email }, { email, schoolUuid: null })
      await user.assignRole(roles.get(ROLES.SUPER_ADMIN)!)
    }
  }
}
