import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

import ResolveOidcUser from '#auth/actions/resolve_oidc_user'
import SchoolInvitation from '#schools/models/school_invitation'
import { ROLES } from '#users/enums/role'
import User from '#users/models/user'
import { assertForbiddenRedirect } from '#tests/helpers/http'
import { createSchool, ensureBaseRoles, makeUser, systemRole } from '#tests/helpers/rbac'

test.group('School members', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.setup(() => ensureBaseRoles())

  test('an admin invites an email that has no account yet', async ({ client, assert }) => {
    const school = await createSchool()
    const admin = await makeUser(ROLES.ADMIN, school)
    const teacherRole = await systemRole(ROLES.TEACHER)

    const response = await client
      .post(`/schools/${school.uuid}/members`)
      .loginAs(admin)
      .withCsrfToken()
      .json({ email: 'future@example.test', roleId: teacherRole.uuid })
      .redirects(0)

    response.assertStatus(302)

    const invitation = await SchoolInvitation.query()
      .where('email', 'future@example.test')
      .firstOrFail()
    assert.equal(invitation.schoolUuid, school.uuid)
    assert.isNull(invitation.acceptedAt)
  })

  test('the OIDC callback consumes a pending invitation on first sign-in', async ({ assert }) => {
    const school = await createSchool()
    const admin = await makeUser(ROLES.ADMIN, school)
    const teacherRole = await systemRole(ROLES.TEACHER)

    await SchoolInvitation.create({
      schoolUuid: school.uuid,
      email: 'future@example.test',
      roleUuid: teacherRole.uuid,
      invitedByUuid: admin.uuid,
      acceptedAt: null,
    })

    const user = await new ResolveOidcUser().handle({
      ferrisUuid: 'ferris-future',
      fullName: 'Future Teacher',
      email: 'future@example.test',
    })

    assert.equal(user.schoolUuid, school.uuid)
    assert.deepEqual(await user.getRoleNames(), [ROLES.TEACHER])

    const invitation = await SchoolInvitation.query()
      .where('email', 'future@example.test')
      .firstOrFail()
    assert.isNotNull(invitation.acceptedAt)
  })

  test('a brand new account with no invitation lands as a student with no school', async ({
    assert,
  }) => {
    const user = await new ResolveOidcUser().handle({
      ferrisUuid: 'ferris-fresh',
      fullName: 'Fresh',
      email: 'fresh@example.test',
    })

    assert.isNull(user.schoolUuid)
    assert.deepEqual(await user.getRoleNames(), [ROLES.STUDENT])
  })

  test('inviting an existing account attaches it immediately', async ({ client, assert }) => {
    const school = await createSchool()
    const admin = await makeUser(ROLES.ADMIN, school)
    const existing = await makeUser(ROLES.STUDENT, null, { email: 'already@example.test' })

    const response = await client
      .post(`/schools/${school.uuid}/members`)
      .loginAs(admin)
      .withCsrfToken()
      .json({ email: 'already@example.test', roleId: null })
      .redirects(0)

    response.assertStatus(302)

    const refreshed = await User.findOrFail(existing.uuid)
    assert.equal(refreshed.schoolUuid, school.uuid)
  })

  test('an admin cannot invite into another school', async ({ client }) => {
    const [a, b] = [await createSchool('A'), await createSchool('B')]
    const admin = await makeUser(ROLES.ADMIN, a)

    const response = await client
      .post(`/schools/${b.uuid}/members`)
      .loginAs(admin)
      .withCsrfToken()
      .json({ email: 'someone@example.test' })
      .redirects(0)

    assertForbiddenRedirect(response)
  })
})
