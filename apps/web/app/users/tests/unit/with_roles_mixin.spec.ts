import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

import { PERMISSIONS } from '#users/enums/permission'
import { ROLES } from '#users/enums/role'
import { UserFactory } from '#users/database/factories/user'
import { ensureBaseRoles, systemRole } from '#tests/helpers/rbac'

test.group('withRoles mixin', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.setup(() => ensureBaseRoles())

  test('assignRole refreshes getRoleNames right away', async ({ assert }) => {
    const user = await UserFactory.create()
    await user.assignRole(await systemRole(ROLES.ADMIN))

    assert.deepEqual(await user.getRoleNames(), [ROLES.ADMIN])
  })

  test('syncRoles replaces the whole set', async ({ assert }) => {
    const user = await UserFactory.create()
    await user.assignRole(await systemRole(ROLES.ADMIN))

    await user.syncRoles([await systemRole(ROLES.STUDENT)])

    assert.deepEqual(await user.getRoleNames(), [ROLES.STUDENT])
  })

  test('revokeRole drops the role and the cached permissions', async ({ assert }) => {
    const user = await UserFactory.create()
    const admin = await systemRole(ROLES.ADMIN)
    await user.assignRole(admin)

    await user.revokeRole(admin)

    assert.deepEqual(await user.getRoleNames(), [])
    assert.isFalse(await user.hasRole(ROLES.ADMIN))
  })

  test('permissions merge across several roles', async ({ assert }) => {
    const user = await UserFactory.create()
    await user.assignRoles([await systemRole(ROLES.TEACHER), await systemRole(ROLES.STUDENT)])

    assert.isTrue(await user.hasPermission(PERMISSIONS.groupsCreate))
    assert.isTrue(await user.hasPermission(PERMISSIONS.examsViewSchedule))
  })

  test('hasPermission reflects the state after syncRoles', async ({ assert }) => {
    const user = await UserFactory.create()
    await user.assignRole(await systemRole(ROLES.ADMIN))
    assert.isTrue(await user.hasPermission(PERMISSIONS.usersViewList))

    await user.syncRoles([await systemRole(ROLES.STUDENT)])

    assert.isFalse(await user.hasPermission(PERMISSIONS.usersViewList))
  })
})
