import { BaseTransformer } from '@adonisjs/core/transformers'

import type Group from '#schools/models/group'

export default class GroupTransformer extends BaseTransformer<Group> {
  toObject() {
    return {
      id: this.resource.uuid,
      name: this.resource.name,
      slug: this.resource.slug,
      schoolId: this.resource.schoolUuid,
    }
  }

  forList() {
    return {
      ...this.toObject(),
      schoolName: this.resource.school?.name ?? null,
      studentsCount: Number(this.resource.$extras.students_count ?? 0),
      createdAt: this.resource.createdAt.toISO()!,
    }
  }

  forEdit() {
    return {
      ...this.toObject(),
    }
  }
}
