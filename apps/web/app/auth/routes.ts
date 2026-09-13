import router from '@adonisjs/core/services/router'

import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

const { Auth } = controllers.auth

router.get('/auth', [Auth, 'index']).middleware(middleware.guest()).as('auth.index')
router
  .get('/auth/ferriskey/redirect', [Auth, 'redirect'])
  .middleware(middleware.guest())
  .as('auth.ferriskey.redirect')
router.get('/auth/ferriskey/callback', [Auth, 'callback']).as('auth.ferriskey.callback')
router.post('/logout', [Auth, 'logout']).middleware(middleware.auth()).as('auth.logout')
