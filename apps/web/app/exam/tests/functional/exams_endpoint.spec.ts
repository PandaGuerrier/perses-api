import { DateTime } from 'luxon'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

import Exam from '#exam/models/exam'
import { PERMISSIONS } from '#users/enums/permission'
import { ROLES } from '#users/enums/role'
import { assertForbiddenRedirect } from '#tests/helpers/http'
import { createSchool, ensureBaseRoles, makeUser, withCustomRole } from '#tests/helpers/rbac'

const payload = (studentUuids: string[]) => ({
  title: 'Algebra',
  description: 'Chapter 3',
  startsAt: DateTime.now().plus({ days: 1 }).toUTC().toISO(),
  endsAt: DateTime.now().plus({ days: 1, hours: 2 }).toUTC().toISO(),
  students: studentUuids,
})

test.group('Endpoint /exams', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.setup(() => ensureBaseRoles())

  test('the stock teacher role cannot create an exam', async ({ client }) => {
    const school = await createSchool()
    const teacher = await makeUser(ROLES.TEACHER, school)
    const student = await makeUser(ROLES.STUDENT, school)

    const response = await client
      .post('/exams')
      .loginAs(teacher)
      .withCsrfToken()
      .json(payload([student.uuid]))
      .redirects(0)

    assertForbiddenRedirect(response)
  })

  test('a custom role carrying exams.create unlocks it for the same teacher', async ({
    client,
    assert,
  }) => {
    const school = await createSchool()
    const teacher = await makeUser(ROLES.TEACHER, school)
    const student = await makeUser(ROLES.STUDENT, school)

    await withCustomRole(teacher, 'examiner', [PERMISSIONS.examsCreate], school.uuid)

    const response = await client
      .post('/exams')
      .loginAs(teacher)
      .withCsrfToken()
      .json(payload([student.uuid]))
      .redirects(0)

    response.assertStatus(302)

    const exam = await Exam.query().where('title', 'Algebra').firstOrFail()
    assert.equal(exam.schoolUuid, school.uuid)

    const targets = await exam.related('students').query()
    assert.deepEqual(
      targets.map((target) => target.uuid),
      [student.uuid]
    )
  })

  test('students from another school are dropped from the target list', async ({
    client,
    assert,
  }) => {
    const [a, b] = [await createSchool('A'), await createSchool('B')]
    const admin = await makeUser(ROLES.ADMIN, a)
    const insider = await makeUser(ROLES.STUDENT, a)
    const outsider = await makeUser(ROLES.STUDENT, b)

    await client
      .post('/exams')
      .loginAs(admin)
      .withCsrfToken()
      .json(payload([insider.uuid, outsider.uuid]))
      .redirects(0)

    const exam = await Exam.query().where('title', 'Algebra').firstOrFail()
    const targets = await exam.related('students').query()

    assert.deepEqual(
      targets.map((target) => target.uuid),
      [insider.uuid]
    )
  })
})
