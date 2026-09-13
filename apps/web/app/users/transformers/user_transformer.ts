import { BaseTransformer } from '@adonisjs/core/transformers'

import type User from '#users/models/user'

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    return {
      id: this.resource.uuid,
      fullName: this.resource.fullName,
      email: this.resource.email,
    }
  }

  forSharedProps() {
    return {
      ...this.toObject(),
      schoolId: this.resource.schoolUuid,
    }
  }

  forList() {
    return {
      ...this.toObject(),
      roles: this.roleNames(),
      schoolId: this.resource.schoolUuid,
      createdAt: this.resource.createdAt.toISO()!,
    }
  }

  forEdit() {
    return {
      ...this.toObject(),
      roles: this.roleNames(),
      schoolId: this.resource.schoolUuid,
    }
  }

  forProfile() {
    return {
      ...this.toObject(),
      roles: this.roleNames(),
    }
  }

  private roleNames() {
    return this.resource.preloadedRoles.map((role) => role.name)
  }
}
