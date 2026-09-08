import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#users/models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'

export default class Cheat extends BaseModel {
  @column({ isPrimary: true })
  declare uuid: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare domain: string

  @column.dateTime()
  declare observedAt: DateTime

  @beforeCreate()
  static generate(model: Cheat) {
    model.uuid = randomUUID()
  }
}
