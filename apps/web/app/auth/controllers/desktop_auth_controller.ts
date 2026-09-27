import type { HttpContext } from '@adonisjs/core/http'

import RedeemDesktopCode from '#auth/actions/redeem_desktop_code'
import { desktopRedirectValidator, desktopTokenValidator } from '#auth/validators/desktop'
import CreateToken from '#users/actions/create_token'
import User from '#users/models/user'

export const DESKTOP_SESSION_KEY = 'desktopAuth'

/**
 * Desktop sign-in rides on the web OIDC flow: the browser completes the
 * Ferriskey login, then `AuthController.callback` hands a one-shot code back to
 * the app's loopback listener instead of opening a web session.
 */
export default class DesktopAuthController {
  async redirect({ ally, request, session }: HttpContext) {
    const { port, challenge } = await request.validateUsing(desktopRedirectValidator, {
      data: request.qs(),
    })

    session.put(DESKTOP_SESSION_KEY, { port, challenge })

    return ally.use('ferriskey').redirect()
  }

  async token({ request, response }: HttpContext) {
    const payload = await request.validateUsing(desktopTokenValidator)

    const user = await new RedeemDesktopCode().handle(payload)
    if (!user) {
      return response.unauthorized({ error: 'invalid_code' })
    }

    const created = await new CreateToken().handle({ owner: user, name: 'Perses Desktop' })

    return { token: created.token }
  }

  async me({ auth }: HttpContext) {
    const user = await User.query()
      .where('uuid', auth.getUserOrFail().uuid)
      .preload('roles')
      .firstOrFail()

    return {
      id: user.uuid,
      fullName: user.fullName,
      email: user.email,
      roles: user.preloadedRoles.map((role) => role.name),
    }
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.use('api').getUserOrFail()
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return response.noContent()
  }
}
