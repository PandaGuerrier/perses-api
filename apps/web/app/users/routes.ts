import router from '@adonisjs/core/services/router'

import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

const { Users, Roles, Settings, Tokens } = controllers.users

router
  .resource('/users', Users)
  .only(['index', 'create', 'store', 'edit', 'update', 'destroy'])
  .use('*', middleware.auth())
  .as('users')

router
  .resource('/roles', Roles)
  .only(['index', 'create', 'store', 'edit', 'update', 'destroy'])
  .use('*', middleware.auth())
  .as('roles')

router.get('/settings', [Settings, 'show']).middleware(middleware.auth()).as('settings.index')
router.post('/settings/tokens', [Tokens, 'store']).middleware(middleware.auth()).as('tokens.store')
router
  .delete('/settings/tokens/:id', [Tokens, 'destroy'])
  .middleware(middleware.auth())
  .as('tokens.destroy')
