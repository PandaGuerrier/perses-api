import { randomUUID } from 'node:crypto'

import { DateTime } from 'luxon'
import { beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import BaseModel from '#common/models/base_model'
import User from '#users/models/user'

export default class Cheat extends BaseModel {
  @column({ isPrimary: true })
  declare uuid: string

  @column()
  declare userUuid: string

  @column()
  declare domain: string

  @column.dateTime()
  declare observedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'userUuid', localKey: 'uuid' })
  declare user: BelongsTo<typeof User>

  @beforeCreate()
  static generate(model: Cheat) {
    model.uuid = randomUUID()
  }
}
