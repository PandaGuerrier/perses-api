import type Busted from '#internal/events/busted'
import User from '#users/models/user'
import transmit from '@adonisjs/transmit/services/main'
import CheatsTransformer from '#internal/transformers/cheats_transformer'

// {"domain":"ws.chatgpt.com","listed":true,"observed_at":1788874017,"client":{"tunnel_ip":"10.8.0.2","public_key":"MgeopD5IZx6znXPiOzvuaw2j9NBJhGd+ijnu60pDcTM=","endpoint":"216.252.190.44:13688","allowed_ips":["10.8.0.2
// /32"],"latest_handshake":1788873979,"transfer_rx":17210256,"transfer_tx":83765416,"persistent_keepalive":null},"server":{"device":"wg0","public_key":"1CelyrYfVw+oDJb9Wxpy6mkfnfybpjQM/jJ1PzK+6iY=","listen_port":51820,"
// peers":1}}
interface BustedPayload {
  domain: string
  observet_at: string
  client: {
    tunnel_ip: string
    public_key: string
  }
}

export default class BustedListener {
  async handle(event: Busted) {
    console.log('busted listener')
    console.log(event.line)

    const payload = JSON.parse(event.line) as BustedPayload
    const user = await User.query().where('public_key', payload.client.public_key).first()

    if (!user) {
      console.log('User not found')
      return
    }

    const cheat = await user.related('cheats').create({
      domain: payload.domain,
      observedAt: payload.observed_at,
    })

    await transmit.broadcast('users:busted', CheatsTransformer.transform(cheat))
    await transmit.broadcast(`users:${user.uuid}:busted`, CheatsTransformer.transform(cheat))
  }
}
