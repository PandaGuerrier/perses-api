import { randomUUID } from 'node:crypto'

import { DateTime } from 'luxon'
import { beforeCreate, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'

import BaseModel from '#common/models/base_model'
import School from '#schools/models/school'
import User from '#users/models/user'

/**
 * An exam targets students directly rather than a group: a group only
 * pre-fills the selection in the form.
 */
export default class Exam extends BaseModel {
  @column({ isPrimary: true })
  declare uuid: string

  @column()
  declare schoolUuid: string

  @column()
  declare createdByUuid: string | null

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column.dateTime()
  declare startsAt: DateTime

  @column.dateTime()
  declare endsAt: DateTime

  @belongsTo(() => School, { foreignKey: 'schoolUuid', localKey: 'uuid' })
  declare school: BelongsTo<typeof School>

  @belongsTo(() => User, { foreignKey: 'createdByUuid', localKey: 'uuid' })
  declare createdBy: BelongsTo<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'exam_users',
    localKey: 'uuid',
    pivotForeignKey: 'exam_uuid',
    relatedKey: 'uuid',
    pivotRelatedForeignKey: 'user_uuid',
  })
  declare students: ManyToMany<typeof User>

  @beforeCreate()
  static generate(model: Exam) {
    model.uuid = randomUUID()
  }
}
