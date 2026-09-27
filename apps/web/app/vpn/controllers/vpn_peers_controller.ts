import type { HttpContext } from '@adonisjs/core/http'

import env from '#start/env'
import ProvisionVpnPeer from '#vpn/actions/provision_vpn_peer'
import { createPeerValidator } from '#vpn/validators/peers'

/**
 * The desktop app keeps its private key: it only sends the public half and gets
 * back everything else it needs to write its WireGuard config.
 */
export default class VpnPeersController {
  async store({ auth, request }: HttpContext) {
    const user = auth.use('api').getUserOrFail()
    const { publicKey } = await request.validateUsing(createPeerValidator, {
      meta: { userUuid: user.uuid },
    })

    const peer = await new ProvisionVpnPeer().handle({ user, publicKey })

    return {
      address: `${peer.address}/32`,
      dns: env.get('WG_DNS') ?? null,
      server: {
        publicKey: env.get('WG_SERVER_PUBLIC_KEY'),
        endpoint: env.get('WG_ENDPOINT'),
        allowedIps: env.get('WG_ALLOWED_IPS'),
        persistentKeepalive: 25,
      },
    }
  }
}
