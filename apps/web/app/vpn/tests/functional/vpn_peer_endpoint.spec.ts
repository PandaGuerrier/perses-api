import { randomBytes } from 'node:crypto'

import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import sinon from 'sinon'

import CreateToken from '#users/actions/create_token'
import { ROLES } from '#users/enums/role'
import VpnPeer from '#vpn/models/vpn_peer'
import wireguard from '#vpn/services/wireguard'
import { ensureBaseRoles, makeUser } from '#tests/helpers/rbac'

const publicKey = () => randomBytes(32).toString('base64')

test.group('Endpoint POST /api/vpn/peer', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  group.each.setup(() => ensureBaseRoles())
  group.each.setup(() => {
    sinon.stub(wireguard, 'setPeer').resolves()
    sinon.stub(wireguard, 'removePeer').resolves()
  })
  group.each.teardown(() => sinon.restore())

  test('sem token responde 401', async ({ client }) => {
    const response = await client.post('/api/vpn/peer').json({ publicKey: publicKey() })
    response.assertStatus(401)
  })

  test('cria o peer no servidor e devolve a config', async ({ client, assert }) => {
    const user = await makeUser(ROLES.STUDENT)
    const { token } = await new CreateToken().handle({ owner: user })
    const key = publicKey()

    const response = await client
      .post('/api/vpn/peer')
      .header('Authorization', `Bearer ${token}`)
      .json({ publicKey: key })

    response.assertStatus(200)
    assert.equal(response.body().address, '10.8.0.2/32')
    assert.isString(response.body().server.publicKey)
    assert.isTrue((wireguard.setPeer as sinon.SinonStub).calledOnceWith(key, '10.8.0.2'))
  })

  test('uma nova chave substitui a antiga e mantem o endereco', async ({ client, assert }) => {
    const user = await makeUser(ROLES.STUDENT)
    const { token } = await new CreateToken().handle({ owner: user })
    const oldKey = publicKey()
    await VpnPeer.create({ userUuid: user.uuid, publicKey: oldKey, address: '10.8.0.7' })
    const newKey = publicKey()

    const response = await client
      .post('/api/vpn/peer')
      .header('Authorization', `Bearer ${token}`)
      .json({ publicKey: newKey })

    response.assertStatus(200)
    assert.equal(response.body().address, '10.8.0.7/32')
    assert.isTrue((wireguard.removePeer as sinon.SinonStub).calledOnceWith(oldKey))
    assert.isTrue((wireguard.setPeer as sinon.SinonStub).calledOnceWith(newKey, '10.8.0.7'))
  })

  test('recusa uma chave publica invalida', async ({ client }) => {
    const user = await makeUser(ROLES.STUDENT)
    const { token } = await new CreateToken().handle({ owner: user })

    const response = await client
      .post('/api/vpn/peer')
      .header('Authorization', `Bearer ${token}`)
      .json({ publicKey: 'not-a-key' })

    response.assertStatus(422)
  })
})
