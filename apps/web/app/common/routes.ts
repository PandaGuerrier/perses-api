import router from '@adonisjs/core/services/router'

import { middleware } from '#start/kernel'

/**
 * The locale switch is middleware-only: it writes the cookie and bounces back,
 * so there is no controller behind it.
 */
router
  .post('/switch/:locale', ({ response }) => response.redirect().back())
  .middleware(middleware.switchLocale())
  .as('locale.switch')
