import router from '@adonisjs/core/services/router'

import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

const { Dashboard } = controllers.dashboard

router.get('/dashboard', [Dashboard, 'show']).middleware(middleware.auth()).as('dashboard.show')
