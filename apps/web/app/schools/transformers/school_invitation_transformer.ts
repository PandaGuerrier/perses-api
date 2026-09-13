import { BaseTransformer } from '@adonisjs/core/transformers'

import type SchoolInvitation from '#schools/models/school_invitation'

export default class SchoolInvitationTransformer extends BaseTransformer<SchoolInvitation> {
  toObject() {
    return {
      id: this.resource.uuid,
      email: this.resource.email,
      roleName: this.resource.role?.name ?? null,
      createdAt: this.resource.createdAt.toISO()!,
    }
  }

  forList() {
    return {
      ...this.toObject(),
      acceptedAt: this.resource.acceptedAt?.toISO() ?? null,
    }
  }
}
