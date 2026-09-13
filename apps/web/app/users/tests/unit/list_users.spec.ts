import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

import { ROLES } from '#users/enums/role'
import ListUsers from '#users/queries/list_users'
import { createSchool, ensureBaseRoles, makeUser } from '#tests/helpers/rbac'

test.group('ListUsers', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.setup(() => ensureBaseRoles())

  test('restricts to one school when a school uuid is given', async ({ assert }) => {
    const [a, b] = [await createSchool('A'), await createSchool('B')]
    const inside = await makeUser(ROLES.STUDENT, a)
    await makeUser(ROLES.STUDENT, b)

    const page = await new ListUsers().handle({ schoolUuid: a.uuid }, { page: 1, perPage: 50 })

    assert.deepEqual(
      page.all().map((user) => user.uuid),
      [inside.uuid]
    )
  })

  test('filters by role name', async ({ assert }) => {
    const school = await createSchool()
    const teacher = await makeUser(ROLES.TEACHER, school)
    await makeUser(ROLES.STUDENT, school)

    const page = await new ListUsers().handle(
      { schoolUuid: school.uuid, roles: [ROLES.TEACHER] },
      { page: 1, perPage: 50 }
    )

    assert.deepEqual(
      page.all().map((user) => user.uuid),
      [teacher.uuid]
    )
  })

  test('matches the search term on name or email', async ({ assert }) => {
    const school = await createSchool()
    const found = await makeUser(ROLES.STUDENT, school, { fullName: 'Grace Hopper' })
    await makeUser(ROLES.STUDENT, school, { fullName: 'Alan Turing' })

    const page = await new ListUsers().handle(
      { schoolUuid: school.uuid, q: 'hopper' },
      { page: 1, perPage: 50 }
    )

    assert.deepEqual(
      page.all().map((user) => user.uuid),
      [found.uuid]
    )
  })
})
