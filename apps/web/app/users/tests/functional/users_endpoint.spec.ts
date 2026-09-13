import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

import { ROLES } from '#users/enums/role'
import { assertForbiddenRedirect } from '#tests/helpers/http'
import { createSchool, ensureBaseRoles, makeUser } from '#tests/helpers/rbac'

test.group('Endpoint /users', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.setup(() => ensureBaseRoles())

  test('GET /users without auth redirects to the login screen', async ({ client, assert }) => {
    const response = await client.get('/users').redirects(0)
    response.assertStatus(302)
    assert.equal(response.header('location'), '/auth')
  })

  test('GET /users as a student is refused', async ({ client }) => {
    const student = await makeUser(ROLES.STUDENT, await createSchool())

    const response = await client.get('/users').loginAs(student).redirects(0)
    assertForbiddenRedirect(response)
  })

  test('GET /users as an admin renders the page', async ({ client }) => {
    const admin = await makeUser(ROLES.ADMIN, await createSchool())

    const response = await client.get('/users').loginAs(admin).withInertia()
    response.assertStatus(200)
    response.assertInertiaComponent('users/index')
  })

  test('an admin only sees the members of their own school', async ({ client, assert }) => {
    const [a, b] = [await createSchool('A'), await createSchool('B')]
    const admin = await makeUser(ROLES.ADMIN, a)
    await makeUser(ROLES.STUDENT, a, { email: 'inside@example.test' })
    await makeUser(ROLES.STUDENT, b, { email: 'outside@example.test' })

    const response = await client.get('/users').loginAs(admin).withInertia()
    response.assertStatus(200)

    const emails = (response.inertiaProps.users.data as { email: string }[]).map((u) => u.email)
    assert.include(emails, 'inside@example.test')
    assert.notInclude(emails, 'outside@example.test')
  })

  test('DELETE /users/:id refuses a target from another school', async ({ client }) => {
    const [a, b] = [await createSchool('A'), await createSchool('B')]
    const admin = await makeUser(ROLES.ADMIN, a)
    const outsider = await makeUser(ROLES.STUDENT, b)

    const response = await client
      .delete(`/users/${outsider.uuid}`)
      .loginAs(admin)
      .withCsrfToken()
      .redirects(0)

    assertForbiddenRedirect(response)
  })
})
