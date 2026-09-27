import vine from '@vinejs/vine'

import VpnPeer from '#vpn/models/vpn_peer'

export const createPeerValidator = vine.withMetaData<{ userUuid: string }>().create({
  // A Curve25519 key: 32 bytes, base64 with its single padding char.
  publicKey: vine
    .string()
    .regex(/^[A-Za-z0-9+/]{42}[AEIMQUYcgkosw048]=$/)
    .unique(async (_, value, field) => {
      const row = await VpnPeer.query()
        .where('public_key', value)
        .whereNot('user_uuid', field.meta.userUuid)
        .first()
      return !row
    }),
})
