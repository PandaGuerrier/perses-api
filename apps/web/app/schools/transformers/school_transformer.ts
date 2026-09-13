import { BaseTransformer } from '@adonisjs/core/transformers'

import type School from '#schools/models/school'

export default class SchoolTransformer extends BaseTransformer<School> {
  toObject() {
    return {
      id: this.resource.uuid,
      name: this.resource.name,
      slug: this.resource.slug,
    }
  }

  forList() {
    return {
      ...this.toObject(),
      description: this.resource.description,
      membersCount: this.counter('members'),
      groupsCount: this.counter('groups'),
      createdAt: this.resource.createdAt.toISO()!,
    }
  }

  forEdit() {
    return {
      ...this.toObject(),
      description: this.resource.description,
    }
  }

  private counter(relation: string): number {
    return Number(this.resource.$extras[`${relation}_count`] ?? 0)
  }
}
