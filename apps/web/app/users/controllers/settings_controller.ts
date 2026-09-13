import type { HttpContext } from '@adonisjs/core/http'

import type User from '#users/models/user'
import TokenPolicy from '#users/policies/token_policy'
import ListUserTokens from '#users/queries/list_user_tokens'
import TokenTransformer from '#users/transformers/token_transformer'
import UserTransformer from '#users/transformers/user_transformer'

interface NewToken {
  name: string
  value: string
}

export default class SettingsController {
  async show({ auth, bouncer, inertia, session }: HttpContext) {
    const user = auth.getUserOrFail() as User
    await user.load('roles')

    const canManageTokens = await bouncer.with(TokenPolicy).allows('viewList')
    const tokens = canManageTokens
      ? TokenTransformer.transform(await new ListUserTokens().handle({ owner: user }))
      : []

    const newToken = (session.flashMessages.get('newToken') as NewToken | undefined) ?? null

    return inertia.render('users/settings', {
      profile: UserTransformer.transform(user).useVariant('forProfile'),
      tokens,
      newToken,
    })
  }
}
