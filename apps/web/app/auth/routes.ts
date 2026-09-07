import router from '@adonisjs/core/services/router'

import { controllers } from '#generated/controllers'

const { Auth } = controllers.auth

router.get('/auth', [Auth, 'index']).as('auth.index')
