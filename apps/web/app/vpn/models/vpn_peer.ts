import { randomUUID } from 'node:crypto'

import { beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import BaseModel from '#common/models/base_model'
import User from '#users/models/user'

/**
 * One tunnel per user: re-provisioning from another device swaps the public
 * key but keeps the address, so server-side rules keyed on it stay valid.
 */
export default class VpnPeer extends BaseModel {
  @column({ isPrimary: true })
  declare uuid: string

  @column()
  declare userUuid: string

  @column()
  declare publicKey: string

  @column()
  declare address: string

  @belongsTo(() => User, { foreignKey: 'userUuid', localKey: 'uuid' })
  declare user: BelongsTo<typeof User>

  @beforeCreate()
  static generate(model: VpnPeer) {
    model.uuid = randomUUID()
  }
}
