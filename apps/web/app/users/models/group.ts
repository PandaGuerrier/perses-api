import BaseModel from '#common/models/base_model'
import { belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import User from '#users/models/user'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import School from '#users/models/school'

export default class Group extends BaseModel {
  @column({ isPrimary: true })
  declare uuid: string

  @column()
  declare slug: string

  @column()
  declare name: string

  @manyToMany(() => User)
  declare students: ManyToMany<typeof User>

  @belongsTo(() => School)
  declare school: BelongsTo<typeof School>
}
