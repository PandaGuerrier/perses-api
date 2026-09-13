import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

import { ROLES } from '#users/enums/role'
import { createSchool, ensureBaseRoles, makeUser } from '#tests/helpers/rbac'

test.group('Exception handler', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.setup(() => ensureBaseRoles())

  test('E_AUTHORIZATION_FAILURE as JSON answers 403 with a message', async ({ client, assert }) => {
    const student = await makeUser(ROLES.STUDENT, await createSchool())

    const response = await client.get('/users').loginAs(student).accept('json').redirects(0)

    response.assertStatus(403)
    assert.property(response.body(), 'message')
    assert.isString(response.body().message)
  })

  test('E_AUTHORIZATION_FAILURE as HTML redirects back', async ({ client, assert }) => {
    const student = await makeUser(ROLES.STUDENT, await createSchool())

    const response = await client.get('/users').loginAs(student).redirects(0)

    response.assertStatus(302)
    assert.equal(response.header('location'), '/')
  })

  test('an unknown page renders the 404 screen', async ({ client }) => {
    const response = await client.get('/does-not-exist').withInertia()

    response.assertStatus(404)
  })
})
