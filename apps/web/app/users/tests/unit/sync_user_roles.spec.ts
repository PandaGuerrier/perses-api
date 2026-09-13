import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

import SyncUserRoles, { assertGrantablePermissions } from '#users/actions/sync_user_roles'
import AdminLockoutException from '#users/exceptions/admin_lockout'
import ManageRolesUnauthorizedException from '#users/exceptions/manage_roles_unauthorized'
import PermissionEscalationException from '#users/exceptions/permission_escalation'
import { PERMISSIONS } from '#users/enums/permission'
import { ROLES } from '#users/enums/role'
import {
  createSchool,
  ensureBaseRoles,
  makeUser,
  systemRoleUuid,
  withCustomRole,
} from '#tests/helpers/rbac'

test.group('SyncUserRoles', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.setup(() => ensureBaseRoles())

  test('an admin swaps a student for a teacher', async ({ assert }) => {
    const school = await createSchool()
    const admin = await makeUser(ROLES.ADMIN, school)
    const target = await makeUser(ROLES.STUDENT, school)

    await new SyncUserRoles().handle({
      target,
      desiredRoleUuids: [await systemRoleUuid(ROLES.TEACHER)],
      executor: admin,
    })

    assert.deepEqual(await target.getRoleNames(), [ROLES.TEACHER])
  })

  test('a teacher cannot change roles at all', async ({ assert }) => {
    const school = await createSchool()
    const teacher = await makeUser(ROLES.TEACHER, school)
    const target = await makeUser(ROLES.STUDENT, school)

    await assert.rejects(
      async () =>
        new SyncUserRoles().handle({
          target,
          desiredRoleUuids: [await systemRoleUuid(ROLES.TEACHER)],
          executor: teacher,
        }),
      ManageRolesUnauthorizedException
    )
  })

  test('an admin cannot hand out super_admin', async ({ assert }) => {
    const school = await createSchool()
    const admin = await makeUser(ROLES.ADMIN, school)
    const target = await makeUser(ROLES.STUDENT, school)

    await assert.rejects(
      async () =>
        new SyncUserRoles().handle({
          target,
          desiredRoleUuids: [await systemRoleUuid(ROLES.SUPER_ADMIN)],
          executor: admin,
        }),
      ManageRolesUnauthorizedException
    )

    assert.deepEqual(await target.getRoleNames(), [ROLES.STUDENT])
  })

  test('an admin cannot drop their own admin role', async ({ assert }) => {
    const school = await createSchool()
    const admin = await makeUser(ROLES.ADMIN, school)

    await assert.rejects(
      async () =>
        new SyncUserRoles().handle({
          target: admin,
          desiredRoleUuids: [await systemRoleUuid(ROLES.STUDENT)],
          executor: admin,
        }),
      AdminLockoutException
    )

    assert.include(await admin.getRoleNames(), ROLES.ADMIN)
  })

  test('a custom role carrying an unheld permission is refused', async ({ assert }) => {
    const school = await createSchool()
    const admin = await makeUser(ROLES.ADMIN, school)

    await assert.rejects(
      () => assertGrantablePermissions(admin, [PERMISSIONS.schoolsCreate]),
      PermissionEscalationException
    )
  })

  test('an admin may hand out a custom role built from permissions they hold', async ({
    assert,
  }) => {
    const school = await createSchool()
    const admin = await makeUser(ROLES.ADMIN, school)
    const teacher = await makeUser(ROLES.TEACHER, school)

    const examiner = await withCustomRole(admin, 'examiner', [PERMISSIONS.examsCreate], school.uuid)

    await new SyncUserRoles().handle({
      target: teacher,
      desiredRoleUuids: [await systemRoleUuid(ROLES.TEACHER), examiner.uuid],
      executor: admin,
    })

    const names = await teacher.getRoleNames()
    assert.includeMembers(names, [ROLES.TEACHER, 'examiner'])
    assert.isTrue(await teacher.hasPermission(PERMISSIONS.examsCreate))
  })
})
