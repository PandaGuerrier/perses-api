import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async index({ inertia }: HttpContext) {
    return inertia.render('auth/index', {})
  }
}
