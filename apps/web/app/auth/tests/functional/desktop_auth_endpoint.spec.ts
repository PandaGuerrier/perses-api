import { createHash, randomBytes } from 'node:crypto'

import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

import IssueDesktopCode from '#auth/actions/issue_desktop_code'
import CreateToken from '#users/actions/create_token'
import User from '#users/models/user'
import { ROLES } from '#users/enums/role'
import { ensureBaseRoles, makeUser } from '#tests/helpers/rbac'

function pkcePair() {
  const verifier = randomBytes(32).toString('base64url')
  const challenge = createHash('sha256').update(verifier).digest('base64url')
  return { verifier, challenge }
}

test.group('Endpoint /api desktop auth', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.setup(() => ensureBaseRoles())

  test('GET /auth/desktop/redirect rejeita porta invalida', async ({ client }) => {
    const { challenge } = pkcePair()

    const response = await client
      .get(`/auth/desktop/redirect?port=80&challenge=${challenge}`)
      .accept('json')
      .redirects(0)

    response.assertStatus(422)
  })

  test('POST /api/auth/desktop/token troca code + verifier por um token', async ({
    client,
    assert,
  }) => {
    const user = await makeUser(ROLES.STUDENT)
    const { verifier, challenge } = pkcePair()
    const code = new IssueDesktopCode().handle({ user, challenge })

    const response = await client.post('/api/auth/desktop/token').json({ code, verifier })

    response.assertStatus(200)
    assert.isString(response.body().token)
    assert.lengthOf(await User.accessTokens.all(user), 1)
  })

  test('POST /api/auth/desktop/token recusa verifier errado', async ({ client, assert }) => {
    const user = await makeUser(ROLES.STUDENT)
    const { challenge } = pkcePair()
    const code = new IssueDesktopCode().handle({ user, challenge })

    const response = await client
      .post('/api/auth/desktop/token')
      .json({ code, verifier: pkcePair().verifier })

    response.assertStatus(401)
    assert.lengthOf(await User.accessTokens.all(user), 0)
  })

  test('GET /api/me sem token responde 401', async ({ client }) => {
    const response = await client.get('/api/me').accept('json')
    response.assertStatus(401)
  })

  test('GET /api/me devolve o usuario do token', async ({ client, assert }) => {
    const user = await makeUser(ROLES.STUDENT)
    const { token } = await new CreateToken().handle({ owner: user })

    const response = await client
      .get('/api/me')
      .header('Authorization', `Bearer ${token}`)
      .accept('json')

    response.assertStatus(200)
    const body = response.body()
    assert.equal(body.id, user.uuid)
  })

  test('DELETE /api/auth/token revoga o token atual', async ({ client, assert }) => {
    const user = await makeUser(ROLES.STUDENT)
    const { token } = await new CreateToken().handle({ owner: user })

    const response = await client
      .delete('/api/auth/token')
      .header('Authorization', `Bearer ${token}`)
      .accept('json')

    response.assertStatus(204)
    assert.lengthOf(await User.accessTokens.all(user), 0)
  })
})
