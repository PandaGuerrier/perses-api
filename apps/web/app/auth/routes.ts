import router from '@adonisjs/core/services/router'

import { controllers } from '#generated/controllers'

const { Auth } = controllers.auth

router.get('/auth', [Auth, 'index']).as('auth.index')
router.get('/auth/ferriskey/redirect', [Auth, 'redirect']).as('auth.ferriskey.redirect')
router.get('/auth/ferriskey/callback', [Auth, 'callback']).as('auth.ferriskey.callback')
