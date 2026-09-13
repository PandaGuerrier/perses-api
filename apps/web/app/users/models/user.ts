import { randomUUID } from 'node:crypto'

import { compose } from '@adonisjs/core/helpers'
import { beforeCreate, belongsTo, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

import BaseModel from '#common/models/base_model'
import Cheat from '#internal/models/cheat'
import Group from '#schools/models/group'
import School from '#schools/models/school'
import StudentProfile from '#users/models/student_profile'
import { withRoles } from '#users/mixins/with_roles'

export default class User extends compose(BaseModel, withRoles()) {
  @column({ isPrimary: true })
  declare uuid: string

  @column()
  declare ferrisUuid: string

  @column()
  declare fullName: string

  @column()
  declare email: string

  /** null for a super-admin, who belongs to no organisation. */
  @column()
  declare schoolUuid: string | null

  @belongsTo(() => School, { foreignKey: 'schoolUuid', localKey: 'uuid' })
  declare school: BelongsTo<typeof School>

  @manyToMany(() => Group, {
    pivotTable: 'group_users',
    localKey: 'uuid',
    pivotForeignKey: 'user_uuid',
    relatedKey: 'uuid',
    pivotRelatedForeignKey: 'group_uuid',
  })
  declare groups: ManyToMany<typeof Group>

  @hasOne(() => StudentProfile, { foreignKey: 'userUuid', localKey: 'uuid' })
  declare studentProfile: HasOne<typeof StudentProfile>

  @hasMany(() => Cheat, { foreignKey: 'userUuid', localKey: 'uuid' })
  declare cheats: HasMany<typeof Cheat>

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @beforeCreate()
  static generate(model: User) {
    model.uuid = randomUUID()
  }
}
