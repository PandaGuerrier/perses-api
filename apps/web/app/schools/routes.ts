import router from '@adonisjs/core/services/router'

import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

const { Schools, Groups, Members } = controllers.schools

router
  .resource('/schools', Schools)
  .only(['index', 'create', 'store', 'edit', 'update', 'destroy'])
  .use('*', middleware.auth())
  .as('schools')

router
  .resource('/groups', Groups)
  .only(['index', 'show', 'create', 'store', 'edit', 'update', 'destroy'])
  .use('*', middleware.auth())
  .as('groups')

router
  .put('/groups/:id/students', [Groups, 'syncStudents'])
  .middleware(middleware.auth())
  .as('groups.students.sync')

router
  .get('/schools/:school_id/members', [Members, 'index'])
  .middleware(middleware.auth())
  .as('schools.members.index')

router
  .post('/schools/:school_id/members', [Members, 'store'])
  .middleware(middleware.auth())
  .as('schools.members.store')

router
  .delete('/schools/:school_id/members/:id', [Members, 'destroy'])
  .middleware(middleware.auth())
  .as('schools.members.destroy')

router
  .delete('/schools/:school_id/invitations/:id', [Members, 'revokeInvitation'])
  .middleware(middleware.auth())
  .as('schools.invitations.destroy')
