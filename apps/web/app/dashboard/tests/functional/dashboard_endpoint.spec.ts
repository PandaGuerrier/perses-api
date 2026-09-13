import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

import { ROLES } from '#users/enums/role'
import { createSchool, ensureBaseRoles, makeUser } from '#tests/helpers/rbac'

test.group('Endpoint /dashboard', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.setup(() => ensureBaseRoles())

  test('a super-admin gets the platform section and nothing school-bound', async ({
    client,
    assert,
  }) => {
    await createSchool()
    const superAdmin = await makeUser(ROLES.SUPER_ADMIN, null)

    const response = await client.get('/dashboard').loginAs(superAdmin).withInertia()
    response.assertStatus(200)
    response.assertInertiaComponent('dashboard/index')

    assert.isNotNull(response.inertiaProps.platform)
    assert.isNull(response.inertiaProps.school)
  })

  test('a student gets a schedule and no platform figures', async ({ client, assert }) => {
    const student = await makeUser(ROLES.STUDENT, await createSchool())

    const response = await client.get('/dashboard').loginAs(student).withInertia()
    response.assertStatus(200)

    assert.isNull(response.inertiaProps.platform)
    assert.isNotNull(response.inertiaProps.schedule)
  })

  test('a teacher gets the teaching section', async ({ client, assert }) => {
    const teacher = await makeUser(ROLES.TEACHER, await createSchool())

    const response = await client.get('/dashboard').loginAs(teacher).withInertia()
    response.assertStatus(200)

    assert.isNotNull(response.inertiaProps.teaching)
    assert.isNull(response.inertiaProps.platform)
  })
})
