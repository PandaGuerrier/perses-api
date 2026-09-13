import { randomUUID } from 'node:crypto'

import { beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

import BaseModel from '#common/models/base_model'
import Group from '#schools/models/group'
import SchoolInvitation from '#schools/models/school_invitation'
import User from '#users/models/user'

export default class School extends BaseModel {
  @column({ isPrimary: true })
  declare uuid: string

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string | null

  @hasMany(() => Group, { foreignKey: 'schoolUuid', localKey: 'uuid' })
  declare groups: HasMany<typeof Group>

  @hasMany(() => User, { foreignKey: 'schoolUuid', localKey: 'uuid' })
  declare members: HasMany<typeof User>

  @hasMany(() => SchoolInvitation, { foreignKey: 'schoolUuid', localKey: 'uuid' })
  declare invitations: HasMany<typeof SchoolInvitation>

  @beforeCreate()
  static generate(model: School) {
    model.uuid = randomUUID()
  }
}
