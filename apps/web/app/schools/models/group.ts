import { randomUUID } from 'node:crypto'

import { beforeCreate, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'

import BaseModel from '#common/models/base_model'
import School from '#schools/models/school'
import User from '#users/models/user'

export default class Group extends BaseModel {
  @column({ isPrimary: true })
  declare uuid: string

  @column()
  declare schoolUuid: string

  @column()
  declare name: string

  @column()
  declare slug: string

  @belongsTo(() => School, { foreignKey: 'schoolUuid', localKey: 'uuid' })
  declare school: BelongsTo<typeof School>

  @manyToMany(() => User, {
    pivotTable: 'group_users',
    localKey: 'uuid',
    pivotForeignKey: 'group_uuid',
    relatedKey: 'uuid',
    pivotRelatedForeignKey: 'user_uuid',
  })
  declare students: ManyToMany<typeof User>

  @beforeCreate()
  static generate(model: Group) {
    model.uuid = randomUUID()
  }
}
