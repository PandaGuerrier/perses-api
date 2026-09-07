import router from '@adonisjs/core/services/router'

import { controllers } from '#generated/controllers'

const { Internal } = controllers.internal

router.get('/internal', [Internal, 'index']).as('internal.index')
