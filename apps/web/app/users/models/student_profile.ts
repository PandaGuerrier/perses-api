import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import BaseModel from '#common/models/base_model'
import User from '#users/models/user'

/** Student-only data. A teacher, admin or super-admin never owns a row here. */
export default class StudentProfile extends BaseModel {
  @column({ isPrimary: true })
  declare userUuid: string

  @column()
  declare publicKey: string | null

  @belongsTo(() => User, { foreignKey: 'userUuid', localKey: 'uuid' })
  declare user: BelongsTo<typeof User>
}
