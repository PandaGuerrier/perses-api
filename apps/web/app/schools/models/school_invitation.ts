import { randomUUID } from 'node:crypto'

import { DateTime } from 'luxon'
import { beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import BaseModel from '#common/models/base_model'
import School from '#schools/models/school'
import Role from '#users/models/role'
import User from '#users/models/user'

/**
 * Accounts are born from an OIDC login, so an admin cannot always attach an
 * email that already exists. The invitation records the intent; the OIDC
 * callback consumes it on the user's first sign-in.
 */
export default class SchoolInvitation extends BaseModel {
  @column({ isPrimary: true })
  declare uuid: string

  @column()
  declare schoolUuid: string

  @column()
  declare email: string

  @column()
  declare roleUuid: string | null

  @column()
  declare invitedByUuid: string | null

  @column.dateTime()
  declare acceptedAt: DateTime | null

  @belongsTo(() => School, { foreignKey: 'schoolUuid', localKey: 'uuid' })
  declare school: BelongsTo<typeof School>

  @belongsTo(() => Role, { foreignKey: 'roleUuid', localKey: 'uuid' })
  declare role: BelongsTo<typeof Role>

  @belongsTo(() => User, { foreignKey: 'invitedByUuid', localKey: 'uuid' })
  declare invitedBy: BelongsTo<typeof User>

  get isPending(): boolean {
    return this.acceptedAt === null
  }

  @beforeCreate()
  static generate(model: SchoolInvitation) {
    model.uuid = randomUUID()
  }
}
