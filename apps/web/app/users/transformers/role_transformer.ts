import { BaseTransformer } from '@adonisjs/core/transformers'

import type Role from '#users/models/role'

export default class RoleTransformer extends BaseTransformer<Role> {
  toObject() {
    return {
      id: this.resource.uuid,
      name: this.resource.name,
      isSystem: this.resource.isSystem,
      schoolId: this.resource.schoolUuid,
    }
  }

  forList() {
    return {
      ...this.toObject(),
      permissions: this.resource.permissions as string[],
      permissionsCount: this.resource.permissions.length,
    }
  }

  forEdit() {
    return {
      ...this.toObject(),
      permissions: this.resource.permissions as string[],
    }
  }
}
