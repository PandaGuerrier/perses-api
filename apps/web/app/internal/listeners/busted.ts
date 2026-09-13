import { DateTime } from 'luxon'
import transmit from '@adonisjs/transmit/services/main'

import type Busted from '#internal/events/busted'
import StudentProfile from '#users/models/student_profile'

// {"domain":"ws.chatgpt.com","observed_at":1788874017,"client":{"public_key":"…"}, …}
interface BustedPayload {
  domain: string
  observed_at: number
  client: {
    tunnel_ip: string
    public_key: string
  }
}

export default class BustedListener {
  async handle(event: Busted) {
    const payload = JSON.parse(event.line) as BustedPayload

    // The public key is student-only data, so the lookup goes through the
    // student profile rather than the users table.
    const profile = await StudentProfile.query()
      .where('public_key', payload.client.public_key)
      .preload('user')
      .first()

    if (!profile) return

    const cheat = await profile.user.related('cheats').create({
      domain: payload.domain,
      observedAt: DateTime.fromSeconds(payload.observed_at),
    })

    const broadcast = {
      id: cheat.uuid,
      userId: profile.userUuid,
      domain: cheat.domain,
      observedAt: cheat.observedAt.toISO(),
    }

    await transmit.broadcast('users:busted', broadcast)
    await transmit.broadcast(`users:${profile.userUuid}:busted`, broadcast)
  }
}
