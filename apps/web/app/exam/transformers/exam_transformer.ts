import { BaseTransformer } from '@adonisjs/core/transformers'

import type Exam from '#exam/models/exam'

export default class ExamTransformer extends BaseTransformer<Exam> {
  toObject() {
    return {
      id: this.resource.uuid,
      title: this.resource.title,
      startsAt: this.resource.startsAt.toISO()!,
      endsAt: this.resource.endsAt.toISO()!,
    }
  }

  forList() {
    return {
      ...this.toObject(),
      description: this.resource.description,
      schoolId: this.resource.schoolUuid,
      schoolName: this.resource.school?.name ?? null,
      studentsCount: Number(this.resource.$extras.students_count ?? 0),
    }
  }

  forEdit() {
    return {
      ...this.toObject(),
      description: this.resource.description,
      schoolId: this.resource.schoolUuid,
      students: this.resource.students?.map((student) => student.uuid) ?? [],
    }
  }

  forSchedule() {
    return {
      ...this.toObject(),
      description: this.resource.description,
    }
  }
}
