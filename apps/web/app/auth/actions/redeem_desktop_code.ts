import { createHash, timingSafeEqual } from 'node:crypto'

import encryption from '@adonisjs/core/services/encryption'

import { DESKTOP_CODE_PURPOSE } from '#auth/actions/issue_desktop_code'
import User from '#users/models/user'

export interface RedeemDesktopCodeInput {
  code: string
  verifier: string
}

export default class RedeemDesktopCode {
  async handle(input: RedeemDesktopCodeInput): Promise<User | null> {
    const payload = encryption.decrypt<{ userUuid: string; challenge: string }>(
      input.code,
      DESKTOP_CODE_PURPOSE
    )
    if (!payload) return null

    const computed = Buffer.from(createHash('sha256').update(input.verifier).digest('base64url'))
    const expected = Buffer.from(payload.challenge)
    if (computed.length !== expected.length || !timingSafeEqual(computed, expected)) return null

    return User.find(payload.userUuid)
  }
}
