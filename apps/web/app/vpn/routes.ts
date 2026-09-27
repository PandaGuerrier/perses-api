import router from '@adonisjs/core/services/router'

import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

const { VpnPeers } = controllers.vpn

router
  .post('/api/vpn/peer', [VpnPeers, 'store'])
  .middleware(middleware.auth({ guards: ['api'] }))
  .as('api.vpn.peer.store')
