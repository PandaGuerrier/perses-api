import { DateTime } from 'luxon'

import Exam from '#exam/models/exam'
import Group from '#schools/models/group'

export type TeachingOverview = {
  groups: { id: string; name: string; studentsCount: number }[]
  upcomingExams: { id: string; title: string; startsAt: string; studentsCount: number }[]
}

export default class GetTeachingOverview {
  async handle({ schoolUuid }: { schoolUuid: string }): Promise<TeachingOverview> {
    const [groups, exams] = await Promise.all([
      Group.query()
        .where('school_uuid', schoolUuid)
        .withCount('students')
        .orderBy('name', 'asc')
        .orderBy('uuid', 'asc')
        .limit(8),
      Exam.query()
        .where('school_uuid', schoolUuid)
        .where('ends_at', '>=', DateTime.now().toSQL()!)
        .withCount('students')
        .orderBy('starts_at', 'asc')
        .orderBy('uuid', 'asc')
        .limit(5),
    ])

    return {
      groups: groups.map((group) => ({
        id: group.uuid,
        name: group.name,
        studentsCount: Number(group.$extras.students_count ?? 0),
      })),
      upcomingExams: exams.map((exam) => ({
        id: exam.uuid,
        title: exam.title,
        startsAt: exam.startsAt.toISO()!,
        studentsCount: Number(exam.$extras.students_count ?? 0),
      })),
    }
  }
}
