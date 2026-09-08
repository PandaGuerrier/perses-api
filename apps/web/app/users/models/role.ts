import { DateTime } from 'luxon'
import { beforeCreate, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

import BaseModel from '#common/models/base_model'
import User from '#users/models/user'

import { isPermission, type Permission } from '#users/enums/permission'
import { randomUUID } from 'node:crypto'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  declare uuid: string

  @column()
  declare name: string

  @column({
    prepare: (value: Permission[]) => JSON.stringify(value ?? []),
    consume: (value: string | Permission[] | null) => {
      if (Array.isArray(value)) return value.filter(isPermission)
      if (!value) return []
      try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed) ? parsed.filter(isPermission) : []
      } catch {
        return []
      }
    },
  })
  declare permissions: Permission[]

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTable: 'user_roles',
    pivotForeignKey: 'role_uuid',
    pivotRelatedForeignKey: 'user_uuid',
  })
  declare users: ManyToMany<typeof User>

  hasPermission(permission: Permission): boolean {
    return this.permissions.includes(permission)
  }

  async givePermissions(permissions: Permission[]): Promise<void> {
    const merged = new Set<Permission>([...this.permissions, ...permissions])
    this.permissions = Array.from(merged)
    await this.save()
  }

  async syncPermissions(permissions: Permission[]): Promise<void> {
    this.permissions = Array.from(new Set(permissions))
    await this.save()
  }

  async revokePermissions(permissions: Permission[]): Promise<void> {
    const toRemove = new Set<string>(permissions)
    this.permissions = this.permissions.filter((permission) => !toRemove.has(permission))
    await this.save()
  }

  @beforeCreate()
  static generate(model: Role) {
    model.uuid = randomUUID()
  }
}
