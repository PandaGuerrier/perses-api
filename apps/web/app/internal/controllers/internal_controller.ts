import type { HttpContext } from '@adonisjs/core/http'

export default class InternalController {
  async index({ inertia }: HttpContext) {
    return inertia.render('internal/index', {})
  }
}
