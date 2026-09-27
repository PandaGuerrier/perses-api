import env from '#start/env'
import type User from '#users/models/user'
import VpnPeer from '#vpn/models/vpn_peer'
import wireguard from '#vpn/services/wireguard'
import VpnSubnetExhaustedException from '#vpn/exceptions/vpn_subnet_exhausted'

export interface ProvisionVpnPeerInput {
  user: User
  publicKey: string
}

export default class ProvisionVpnPeer {
  async handle(input: ProvisionVpnPeerInput): Promise<VpnPeer> {
    let peer = await VpnPeer.findBy('userUuid', input.user.uuid)

    if (!peer) {
      peer = await VpnPeer.create({
        userUuid: input.user.uuid,
        publicKey: input.publicKey,
        address: await this.nextFreeAddress(),
      })
    } else if (peer.publicKey !== input.publicKey) {
      await wireguard.removePeer(peer.publicKey)
      peer.publicKey = input.publicKey
      await peer.save()
    }

    await wireguard.setPeer(peer.publicKey, peer.address)

    return peer
  }

  /**
   * The subnet's first host is the server itself, the last one its broadcast.
   */
  private async nextFreeAddress(): Promise<string> {
    const [network, bits] = env.get('WG_SUBNET').split('/')
    const base = toInt(network)
    const size = 2 ** (32 - Number(bits))

    const taken = new Set((await VpnPeer.query().select('address')).map((p) => toInt(p.address)))

    for (let offset = 2; offset < size - 1; offset++) {
      if (!taken.has(base + offset)) return toIp(base + offset)
    }

    throw new VpnSubnetExhaustedException()
  }
}

function toInt(ip: string): number {
  return ip.split('.').reduce((acc, octet) => acc * 256 + Number(octet), 0)
}

function toIp(value: number): string {
  return [24, 16, 8, 0].map((shift) => Math.floor(value / 2 ** shift) % 256).join('.')
}
