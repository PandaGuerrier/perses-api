import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

import { PERMISSIONS } from '#users/enums/permission'
import { ROLES } from '#users/enums/role'
import Role from '#users/models/role'
import { assertForbiddenRedirect } from '#tests/helpers/http'
import { createSchool, ensureBaseRoles, makeUser, systemRole } from '#tests/helpers/rbac'

test.group('Endpoint /roles', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.setup(() => ensureBaseRoles())

  test('GET /roles as a teacher is refused', async ({ client }) => {
    const teacher = await makeUser(ROLES.TEACHER, await createSchool())

    const response = await client.get('/roles').loginAs(teacher).redirects(0)
    assertForbiddenRedirect(response)
  })

  test('GET /roles as an admin renders the page', async ({ client }) => {
    const admin = await makeUser(ROLES.ADMIN, await createSchool())

    const response = await client.get('/roles').loginAs(admin).withInertia()
    response.assertStatus(200)
    response.assertInertiaComponent('users/roles/index')
  })

  test('an admin creates a custom role scoped to their school', async ({ client, assert }) => {
    const school = await createSchool()
    const admin = await makeUser(ROLES.ADMIN, school)

    const response = await client
      .post('/roles')
      .loginAs(admin)
      .withCsrfToken()
      .json({ name: 'examiner', permissions: [PERMISSIONS.examsCreate] })
      .redirects(0)

    response.assertStatus(302)

    const role = await Role.query().where('name', 'examiner').firstOrFail()
    assert.equal(role.schoolUuid, school.uuid)
    assert.isFalse(role.isSystem)
  })

  test('an admin cannot grant a permission they do not hold', async ({ client, assert }) => {
    const admin = await makeUser(ROLES.ADMIN, await createSchool())

    const response = await client
      .post('/roles')
      .loginAs(admin)
      .withCsrfToken()
      .accept('json')
      .json({ name: 'over-reach', permissions: [PERMISSIONS.schoolsCreate] })
      .redirects(0)

    response.assertStatus(403)
    assert.isNull(await Role.query().where('name', 'over-reach').first())
  })

  test('a system role cannot be edited', async ({ client }) => {
    const admin = await makeUser(ROLES.ADMIN, await createSchool())
    const teacherRole = await systemRole(ROLES.TEACHER)

    const response = await client
      .put(`/roles/${teacherRole.uuid}`)
      .loginAs(admin)
      .withCsrfToken()
      .json({ name: 'teacher', permissions: [] })
      .redirects(0)

    assertForbiddenRedirect(response)
  })
})
