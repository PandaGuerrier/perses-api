import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

import { ROLES } from '#users/enums/role'
import UserPolicy from '#users/policies/user_policy'
import { createSchool, ensureBaseRoles, makeUser } from '#tests/helpers/rbac'

test.group('UserPolicy', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.setup(() => ensureBaseRoles())

  test('an admin may update a member of their own school', async ({ assert }) => {
    const school = await createSchool()
    const admin = await makeUser(ROLES.ADMIN, school)
    const member = await makeUser(ROLES.STUDENT, school)

    assert.isTrue(await new UserPolicy().update(admin, member))
  })

  test('an admin may not update a member of another school', async ({ assert }) => {
    const [a, b] = [await createSchool('A'), await createSchool('B')]
    const admin = await makeUser(ROLES.ADMIN, a)
    const outsider = await makeUser(ROLES.STUDENT, b)

    assert.isFalse(await new UserPolicy().update(admin, outsider))
  })

  test('a super-admin reaches every school', async ({ assert }) => {
    const school = await createSchool()
    const superAdmin = await makeUser(ROLES.SUPER_ADMIN, null)
    const member = await makeUser(ROLES.STUDENT, school)

    assert.isTrue(await new UserPolicy().update(superAdmin, member))
  })

  test('nobody deletes themselves', async ({ assert }) => {
    const superAdmin = await makeUser(ROLES.SUPER_ADMIN, null)

    assert.isFalse(await new UserPolicy().delete(superAdmin, superAdmin))
  })

  test('a student sees no user list', async ({ assert }) => {
    const school = await createSchool()
    const student = await makeUser(ROLES.STUDENT, school)

    assert.isFalse(await new UserPolicy().viewList(student))
  })
})
