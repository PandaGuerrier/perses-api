import router from '@adonisjs/core/services/router'

import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

const { Auth, DesktopAuth } = controllers.auth

router.get('/auth', [Auth, 'index']).middleware(middleware.guest()).as('auth.index')
router
  .get('/auth/ferriskey/redirect', [Auth, 'redirect'])
  .middleware(middleware.guest())
  .as('auth.ferriskey.redirect')
router.get('/auth/ferriskey/callback', [Auth, 'callback']).as('auth.ferriskey.callback')
router.post('/logout', [Auth, 'logout']).middleware(middleware.auth()).as('auth.logout')

router.get('/auth/desktop/redirect', [DesktopAuth, 'redirect']).as('auth.desktop.redirect')

router
  .group(() => {
    router.post('/auth/desktop/token', [DesktopAuth, 'token']).as('token')
    router
      .get('/me', [DesktopAuth, 'me'])
      .middleware(middleware.auth({ guards: ['api'] }))
      .as('me')
    router
      .delete('/auth/token', [DesktopAuth, 'logout'])
      .middleware(middleware.auth({ guards: ['api'] }))
      .as('logout')
  })
  .prefix('/api')
  .as('api.desktop')
