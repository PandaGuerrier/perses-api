import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

import env from '#start/env'

const run = promisify(execFile)

/**
 * Drives the WireGuard interface living on the API host through `wg set`, so
 * the process needs CAP_NET_ADMIN on it. Peers are applied live and never
 * written to the interface config: `vpn_peers` is the source of truth.
 */
export class Wireguard {
  constructor(private iface = env.get('WG_INTERFACE')) {}

  async setPeer(publicKey: string, address: string) {
    await run('wg', ['set', this.iface, 'peer', publicKey, 'allowed-ips', `${address}/32`])
  }

  async removePeer(publicKey: string) {
    await run('wg', ['set', this.iface, 'peer', publicKey, 'remove'])
  }
}

export default new Wireguard()
