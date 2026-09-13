import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

import School from '#schools/models/school'
import { ROLES } from '#users/enums/role'
import { assertForbiddenRedirect } from '#tests/helpers/http'
import { createSchool, ensureBaseRoles, makeUser } from '#tests/helpers/rbac'

test.group('Endpoint /schools', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.setup(() => ensureBaseRoles())

  test('a student is refused', async ({ client }) => {
    const student = await makeUser(ROLES.STUDENT, await createSchool())

    const response = await client.get('/schools').loginAs(student).redirects(0)
    assertForbiddenRedirect(response)
  })

  test('a super-admin lists every school', async ({ client, assert }) => {
    await createSchool('A')
    await createSchool('B')
    const superAdmin = await makeUser(ROLES.SUPER_ADMIN, null)

    const response = await client.get('/schools').loginAs(superAdmin).withInertia()
    response.assertStatus(200)
    response.assertInertiaComponent('schools/index')
    assert.lengthOf(response.inertiaProps.schools.data as unknown[], 2)
  })

  test('an admin only sees their own school', async ({ client, assert }) => {
    const [a] = [await createSchool('A'), await createSchool('B')]
    const admin = await makeUser(ROLES.ADMIN, a)

    const response = await client.get('/schools').loginAs(admin).withInertia()
    response.assertStatus(200)

    const rows = response.inertiaProps.schools.data as { id: string }[]
    assert.deepEqual(
      rows.map((row) => row.id),
      [a.uuid]
    )
  })

  test('an admin cannot create a school', async ({ client }) => {
    const admin = await makeUser(ROLES.ADMIN, await createSchool())

    const response = await client
      .post('/schools')
      .loginAs(admin)
      .withCsrfToken()
      .json({ name: 'Sneaky' })
      .redirects(0)

    assertForbiddenRedirect(response)
  })

  test('a super-admin creates a school with a generated slug', async ({ client, assert }) => {
    const superAdmin = await makeUser(ROLES.SUPER_ADMIN, null)

    const response = await client
      .post('/schools')
      .loginAs(superAdmin)
      .withCsrfToken()
      .json({ name: 'Lycée Victor Hugo' })
      .redirects(0)

    response.assertStatus(302)

    const school = await School.query().where('name', 'Lycée Victor Hugo').firstOrFail()
    assert.equal(school.slug, 'lycee-victor-hugo')
  })
})
