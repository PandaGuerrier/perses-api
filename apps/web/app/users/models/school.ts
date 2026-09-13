import BaseModel from '#common/models/base_model'
import { column, hasMany } from '@adonisjs/lucid/orm'
import Group from '#users/models/group'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class School extends BaseModel {
  @column({ isPrimary: true })
  declare uuid: string

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string

  @hasMany(() => Group)
  declare groups: HasMany<typeof Group>
}
