import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

import BaseModel from '#common/models/base_model'

import { withRoles } from '#users/mixins/with_roles'
import Cheat from '#internal/models/cheat'
import { randomUUID } from 'node:crypto'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder, withRoles()) {
  @column({ isPrimary: true })
  declare uuid: string

  @column()
  declare ferrisUuid: string

  @column()
  declare fullName: string

  @column()
  declare publicKey: string

  @column()
  declare email: string

  @hasMany(() => Cheat)
  declare cheats: HasMany<typeof Cheat>

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @beforeCreate()
  static generate(model: User) {
    model.uuid = randomUUID()
  }
}
