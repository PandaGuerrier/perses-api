import { DateTime } from 'luxon'

import SyncExamStudents from '#exam/actions/sync_exam_students'
import type Exam from '#exam/models/exam'

export interface UpdateExamInput {
  target: Exam
  title: string
  description: string | null
  startsAt: Date
  endsAt: Date
  studentUuids: string[]
}

export default class UpdateExam {
  async handle(input: UpdateExamInput): Promise<Exam> {
    input.target.merge({
      title: input.title,
      description: input.description,
      startsAt: DateTime.fromJSDate(input.startsAt),
      endsAt: DateTime.fromJSDate(input.endsAt),
    })
    await input.target.save()

    await new SyncExamStudents().handle({
      exam: input.target,
      studentUuids: input.studentUuids,
    })

    return input.target
  }
}
