import router from '@adonisjs/core/services/router'
import transmit from '@adonisjs/transmit/services/main'
import { controllers } from '#generated/controllers'

const { Internal } = controllers.internal

router.get('/internal', [Internal, 'index']).as('internal.index')
transmit.registerRoutes((route) => {
  if (route.getPattern() === '__transmit/events') {
    //route.middleware(middleware.auth())
  }
})
