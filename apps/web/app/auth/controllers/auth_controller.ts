import type { HttpContext } from '@adonisjs/core/http'
import * as console from 'node:console'
import User from '#users/models/user'

export default class AuthController {
  async index({ inertia }: HttpContext) {
    return inertia.render('auth/index', {})
  }

  async redirect({ ally }: HttpContext) {
    return ally.use('ferriskey').redirect()
  }

  async callback({ ally, response, auth }: HttpContext) {
    const ferriskey = ally.use('ferriskey')

    if (ferriskey.accessDenied() || ferriskey.stateMisMatch() || ferriskey.hasError()) {
      return response.redirect().toRoute('auth.index')
    }

    const oidcUser = await ferriskey.user()

    console.log(oidcUser.id)

    const user = await User.firstOrCreate({ ferrisUuid: oidcUser.id }, {
      ferrisUuid: oidcUser.id,
      fullName: oidcUser.name,
      email: oidcUser.email
    })

    await auth.use('web').login(user)

    return oidcUser
  }
}
