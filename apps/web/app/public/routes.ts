import router from '@adonisjs/core/services/router'

import { controllers } from '#generated/controllers'

const { Public } = controllers.public

router.get('/', [Public, 'index']).as('public.index')
