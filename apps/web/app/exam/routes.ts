import router from '@adonisjs/core/services/router'

import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

const { Exams, Schedule } = controllers.exam

router
  .resource('/exams', Exams)
  .only(['index', 'create', 'store', 'edit', 'update', 'destroy'])
  .use('*', middleware.auth())
  .as('exams')

router.get('/schedule', [Schedule, 'show']).middleware(middleware.auth()).as('schedule.show')
