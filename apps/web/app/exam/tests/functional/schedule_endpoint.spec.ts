import { DateTime } from 'luxon'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

import Exam from '#exam/models/exam'
import { ROLES } from '#users/enums/role'
import { assertForbiddenRedirect } from '#tests/helpers/http'
import { createSchool, ensureBaseRoles, makeUser } from '#tests/helpers/rbac'

test.group('Endpoint /schedule', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.setup(() => ensureBaseRoles())

  test('a student only sees the exams they are targeted by', async ({ client, assert }) => {
    const school = await createSchool()
    const student = await makeUser(ROLES.STUDENT, school)
    const classmate = await makeUser(ROLES.STUDENT, school)

    const mine = await Exam.create({
      schoolUuid: school.uuid,
      createdByUuid: null,
      title: 'Mine',
      description: null,
      startsAt: DateTime.now().plus({ days: 1 }),
      endsAt: DateTime.now().plus({ days: 1, hours: 1 }),
    })
    await mine.related('students').attach([student.uuid])

    const theirs = await Exam.create({
      schoolUuid: school.uuid,
      createdByUuid: null,
      title: 'Theirs',
      description: null,
      startsAt: DateTime.now().plus({ days: 2 }),
      endsAt: DateTime.now().plus({ days: 2, hours: 1 }),
    })
    await theirs.related('students').attach([classmate.uuid])

    const response = await client.get('/schedule').loginAs(student).withInertia()
    response.assertStatus(200)
    response.assertInertiaComponent('exam/schedule')

    const titles = (response.inertiaProps.exams as { title: string }[]).map((exam) => exam.title)
    assert.deepEqual(titles, ['Mine'])
  })

  test('a teacher has no schedule of their own', async ({ client }) => {
    const teacher = await makeUser(ROLES.TEACHER, await createSchool())

    const response = await client.get('/schedule').loginAs(teacher).redirects(0)
    assertForbiddenRedirect(response)
  })
})
