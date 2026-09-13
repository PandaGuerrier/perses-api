import type { HttpContext } from '@adonisjs/core/http'

import { afterAuthLogoutRedirectRoute, afterAuthRedirectRoute } from '#config/auth'

import ResolveOidcUser from '#auth/actions/resolve_oidc_user'

export default class AuthController {
  async index({ inertia }: HttpContext) {
    return inertia.render('auth/index', {})
  }

  async redirect({ ally }: HttpContext) {
    return ally.use('ferriskey').redirect()
  }

  async callback({ ally, auth, response }: HttpContext) {
    const ferriskey = ally.use('ferriskey')

    if (ferriskey.accessDenied() || ferriskey.stateMisMatch() || ferriskey.hasError()) {
      return response.redirect().toRoute('auth.index')
    }

    const oidcUser = await ferriskey.user()

    const user = await new ResolveOidcUser().handle({
      ferrisUuid: oidcUser.id,
      fullName: oidcUser.name,
      email: oidcUser.email,
    })

    await auth.use('web').login(user)

    return response.redirect().toRoute(afterAuthRedirectRoute)
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()

    return response.redirect().toRoute(afterAuthLogoutRedirectRoute)
  }
}
