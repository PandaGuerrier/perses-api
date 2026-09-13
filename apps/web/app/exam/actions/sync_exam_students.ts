import type Exam from '#exam/models/exam'
import { ROLES } from '#users/enums/role'
import User from '#users/models/user'

export interface SyncExamStudentsInput {
  exam: Exam
  studentUuids: string[]
}

export default class SyncExamStudents {
  async handle({ exam, studentUuids }: SyncExamStudentsInput): Promise<void> {
    // The form may submit a whole group; anyone outside the exam's school or
    // who is not a student is dropped here rather than trusted from the client.
    const eligible = await User.query()
      .whereIn('uuid', studentUuids.length > 0 ? studentUuids : [''])
      .where('school_uuid', exam.schoolUuid)
      .whereHas('roles', (roles) => roles.where('name', ROLES.STUDENT))

    await exam.related('students').sync(eligible.map((student) => student.uuid))
  }
}
