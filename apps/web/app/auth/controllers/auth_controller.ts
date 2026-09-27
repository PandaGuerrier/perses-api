import type { HttpContext } from '@adonisjs/core/http'

import { afterAuthLogoutRedirectRoute, afterAuthRedirectRoute } from '#config/auth'

import IssueDesktopCode from '#auth/actions/issue_desktop_code'
import ResolveOidcUser from '#auth/actions/resolve_oidc_user'
import { DESKTOP_SESSION_KEY } from '#auth/controllers/desktop_auth_controller'

export default class AuthController {
  async index({ inertia }: HttpContext) {
    return inertia.render('auth/index', {})
  }

  async redirect({ ally }: HttpContext) {
    return ally.use('ferriskey').redirect()
  }

  async callback({ ally, auth, response, session }: HttpContext) {
    const ferriskey = ally.use('ferriskey')
    const desktop: { port: number; challenge: string } | undefined =
      session.pull(DESKTOP_SESSION_KEY)
    const desktopCallback = desktop && `http://127.0.0.1:${desktop.port}/callback`

    if (ferriskey.accessDenied() || ferriskey.stateMisMatch() || ferriskey.hasError()) {
      if (desktopCallback) return response.redirect(`${desktopCallback}?error=access_denied`)
      return response.redirect().toRoute('auth.index')
    }

    const oidcUser = await ferriskey.user()

    const user = await new ResolveOidcUser().handle({
      ferrisUuid: oidcUser.id,
      fullName: oidcUser.name,
      email: oidcUser.email,
    })

    if (desktop) {
      const code = new IssueDesktopCode().handle({ user, challenge: desktop.challenge })
      return response.redirect(`${desktopCallback}?code=${encodeURIComponent(code)}`)
    }

    await auth.use('web').login(user)

    return response.redirect().toRoute(afterAuthRedirectRoute)
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()

    return response.redirect().toRoute(afterAuthLogoutRedirectRoute)
  }
}
