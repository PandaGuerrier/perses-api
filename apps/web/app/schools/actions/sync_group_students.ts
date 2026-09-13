import type Group from '#schools/models/group'
import { ROLES } from '#users/enums/role'
import User from '#users/models/user'

export interface SyncGroupStudentsInput {
  group: Group
  studentUuids: string[]
}

export default class SyncGroupStudents {
  async handle({ group, studentUuids }: SyncGroupStudentsInput): Promise<void> {
    // Silently drop anything outside the group's own school, or anyone who is
    // not a student: a group is a class, never a staff list.
    const eligible = await User.query()
      .whereIn('uuid', studentUuids.length > 0 ? studentUuids : [''])
      .where('school_uuid', group.schoolUuid)
      .whereHas('roles', (roles) => roles.where('name', ROLES.STUDENT))

    await group.related('students').sync(eligible.map((student) => student.uuid))
  }
}
