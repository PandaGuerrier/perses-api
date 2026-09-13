import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

import CreateUser from '#users/actions/create_user'
import ManageRolesUnauthorizedException from '#users/exceptions/manage_roles_unauthorized'
import { ROLES } from '#users/enums/role'
import { createSchool, ensureBaseRoles, makeUser, systemRoleUuid } from '#tests/helpers/rbac'

test.group('CreateUser', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.setup(() => ensureBaseRoles())

  test('a super-admin creates a student inside a school', async ({ db, assert }) => {
    const school = await createSchool()
    const superAdmin = await makeUser(ROLES.SUPER_ADMIN, null)

    const created = await new CreateUser().handle({
      fullName: 'New Student',
      email: 'new-student@example.test',
      roleUuids: [await systemRoleUuid(ROLES.STUDENT)],
      schoolUuid: school.uuid,
      executor: superAdmin,
    })

    await db.assertHas('users', { email: 'new-student@example.test' })
    assert.equal(created.schoolUuid, school.uuid)
    assert.deepEqual(await created.getRoleNames(), [ROLES.STUDENT])
  })

  test('an admin cannot create a super-admin', async ({ assert }) => {
    const school = await createSchool()
    const admin = await makeUser(ROLES.ADMIN, school)

    await assert.rejects(
      async () =>
        new CreateUser().handle({
          fullName: 'Escalation',
          email: 'escalation@example.test',
          roleUuids: [await systemRoleUuid(ROLES.SUPER_ADMIN)],
          schoolUuid: school.uuid,
          executor: admin,
        }),
      ManageRolesUnauthorizedException
    )
  })
})
