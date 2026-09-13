import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

import DeleteUser from '#users/actions/delete_user'
import { ROLES } from '#users/enums/role'
import { createSchool, ensureBaseRoles, makeUser } from '#tests/helpers/rbac'

test.group('DeleteUser', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.setup(() => ensureBaseRoles())

  test('removes the row', async ({ db }) => {
    const school = await createSchool()
    const target = await makeUser(ROLES.STUDENT, school, { email: 'gone@example.test' })

    await new DeleteUser().handle({ target })

    await db.assertMissing('users', { email: 'gone@example.test' })
  })
})
