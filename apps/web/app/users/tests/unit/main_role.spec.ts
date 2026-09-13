import { test } from '@japa/runner'

import { ROLES, mainRole } from '#users/enums/role'

test.group('mainRole', () => {
  test('returns null for an empty list', ({ assert }) => {
    assert.isNull(mainRole([]))
  })

  test('returns null when no role is a built-in one', ({ assert }) => {
    // Custom roles an admin authored are unknown here, by design.
    assert.isNull(mainRole(['examiner', 'guest']))
  })

  test('returns the only known role', ({ assert }) => {
    assert.equal(mainRole([ROLES.STUDENT]), ROLES.STUDENT)
    assert.equal(mainRole([ROLES.TEACHER]), ROLES.TEACHER)
  })

  test('picks the heaviest role', ({ assert }) => {
    assert.equal(mainRole([ROLES.STUDENT, ROLES.TEACHER]), ROLES.TEACHER)
    assert.equal(mainRole([ROLES.TEACHER, ROLES.ADMIN]), ROLES.ADMIN)
    assert.equal(mainRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]), ROLES.SUPER_ADMIN)
  })

  test('ignores unknown roles and chooses among the known ones', ({ assert }) => {
    assert.equal(mainRole(['examiner', ROLES.TEACHER, 'guest']), ROLES.TEACHER)
    assert.equal(mainRole(['examiner', ROLES.STUDENT, ROLES.ADMIN]), ROLES.ADMIN)
  })
})
