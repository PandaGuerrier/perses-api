import { DateTime } from 'luxon'

import Exam from '#exam/models/exam'

export interface ListUserScheduleInput {
  userUuid: string
  from?: DateTime
  limit?: number
}

/** A student's timetable: the exams they are personally targeted by. */
export default class ListUserSchedule {
  async handle({ userUuid, from, limit }: ListUserScheduleInput): Promise<Exam[]> {
    const query = Exam.query()
      .whereHas('students', (students) => students.where('users.uuid', userUuid))
      .where('ends_at', '>=', (from ?? DateTime.now()).toSQL()!)
      .orderBy('starts_at', 'asc')
      .orderBy('uuid', 'asc')

    if (limit) query.limit(limit)

    return query
  }
}
