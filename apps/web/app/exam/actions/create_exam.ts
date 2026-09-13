import { DateTime } from 'luxon'

import Exam from '#exam/models/exam'
import SyncExamStudents from '#exam/actions/sync_exam_students'
import type User from '#users/models/user'

export interface CreateExamInput {
  schoolUuid: string
  title: string
  description: string | null
  startsAt: Date
  endsAt: Date
  studentUuids: string[]
  executor: User
}

export default class CreateExam {
  async handle(input: CreateExamInput): Promise<Exam> {
    const exam = await Exam.create({
      schoolUuid: input.schoolUuid,
      createdByUuid: input.executor.uuid,
      title: input.title,
      description: input.description,
      startsAt: DateTime.fromJSDate(input.startsAt),
      endsAt: DateTime.fromJSDate(input.endsAt),
    })

    await new SyncExamStudents().handle({ exam, studentUuids: input.studentUuids })

    return exam
  }
}
