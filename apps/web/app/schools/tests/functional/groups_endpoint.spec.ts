import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

import Group from '#schools/models/group'
import { ROLES } from '#users/enums/role'
import { assertForbiddenRedirect } from '#tests/helpers/http'
import { createSchool, ensureBaseRoles, makeUser } from '#tests/helpers/rbac'

test.group('Endpoint /groups', (suite) => {
  suite.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  suite.each.setup(() => ensureBaseRoles())

  test('a teacher creates a group in their own school', async ({ client, assert }) => {
    const school = await createSchool()
    const teacher = await makeUser(ROLES.TEACHER, school)

    const response = await client
      .post('/groups')
      .loginAs(teacher)
      .withCsrfToken()
      .json({ name: 'Terminale S' })
      .redirects(0)

    response.assertStatus(302)

    const created = await Group.query().where('name', 'Terminale S').firstOrFail()
    assert.equal(created.schoolUuid, school.uuid)
  })

  test("a teacher cannot touch another school's group", async ({ client }) => {
    const [a, b] = [await createSchool('A'), await createSchool('B')]
    const teacher = await makeUser(ROLES.TEACHER, a)
    const foreign = await Group.create({ schoolUuid: b.uuid, name: 'Foreign', slug: 'foreign' })

    const response = await client
      .put(`/groups/${foreign.uuid}`)
      .loginAs(teacher)
      .withCsrfToken()
      .json({ name: 'Hijacked' })
      .redirects(0)

    assertForbiddenRedirect(response)
  })

  test('only students of the school end up in a group', async ({ client, assert }) => {
    const [a, b] = [await createSchool('A'), await createSchool('B')]
    const teacher = await makeUser(ROLES.TEACHER, a)
    const group = await Group.create({ schoolUuid: a.uuid, name: 'L1', slug: 'l1' })

    const insider = await makeUser(ROLES.STUDENT, a)
    const outsider = await makeUser(ROLES.STUDENT, b)
    const colleague = await makeUser(ROLES.TEACHER, a)

    const response = await client
      .put(`/groups/${group.uuid}/students`)
      .loginAs(teacher)
      .withCsrfToken()
      .json({ students: [insider.uuid, outsider.uuid, colleague.uuid] })
      .redirects(0)

    response.assertStatus(302)

    const students = await group.related('students').query()
    assert.deepEqual(
      students.map((student) => student.uuid),
      [insider.uuid]
    )
  })

  test('a student cannot reach the group list', async ({ client }) => {
    const student = await makeUser(ROLES.STUDENT, await createSchool())

    const response = await client.get('/groups').loginAs(student).redirects(0)
    assertForbiddenRedirect(response)
  })
})
