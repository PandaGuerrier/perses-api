import encryption from '@adonisjs/core/services/encryption'

import type User from '#users/models/user'

export const DESKTOP_CODE_PURPOSE = 'desktop-auth'

export interface IssueDesktopCodeInput {
  user: User
  challenge: string
}

/**
 * The code travels through the browser to the desktop app's loopback listener,
 * so it is short-lived and bound to the PKCE challenge: intercepting it is
 * useless without the verifier that never leaves the app.
 */
export default class IssueDesktopCode {
  handle(input: IssueDesktopCodeInput): string {
    return encryption.encrypt(
      { userUuid: input.user.uuid, challenge: input.challenge },
      '2 minutes',
      DESKTOP_CODE_PURPOSE
    )
  }
}
