import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

import { ROLES } from '#users/enums/role'
import UserTransformer from '#users/transformers/user_transformer'
import { createSchool, ensureBaseRoles, makeUser } from '#tests/helpers/rbac'

test.group('UserTransformer', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.setup(() => ensureBaseRoles())

  test('exposes the uuid as id and never leaks internal columns', async ({ assert }) => {
    const school = await createSchool()
    const user = await makeUser(ROLES.STUDENT, school, { fullName: 'Ada' })
    await user.load('roles')

    const payload = new UserTransformer(user).forList()

    assert.equal(payload.id, user.uuid)
    assert.equal(payload.fullName, 'Ada')
    assert.equal(payload.schoolId, school.uuid)
    assert.deepEqual(payload.roles, [ROLES.STUDENT])
  })
})
