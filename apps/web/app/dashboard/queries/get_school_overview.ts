import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

import School from '#schools/models/school'
import { ROLES } from '#users/enums/role'

export type SchoolOverview = {
  name: string
  students: number
  teachers: number
  groups: number
  upcomingExams: number
  pendingInvitations: number
}

export default class GetSchoolOverview {
  async handle({ schoolUuid }: { schoolUuid: string }): Promise<SchoolOverview | null> {
    const school = await School.find(schoolUuid)
    if (!school) return null

    const [students, teachers, groups, exams, invitations] = await Promise.all([
      countByRole(schoolUuid, ROLES.STUDENT),
      countByRole(schoolUuid, ROLES.TEACHER),
      db.from('groups').where('school_uuid', schoolUuid).count('* as total').first(),
      db
        .from('exams')
        .where('school_uuid', schoolUuid)
        .where('ends_at', '>=', DateTime.now().toSQL()!)
        .count('* as total')
        .first(),
      db
        .from('school_invitations')
        .where('school_uuid', schoolUuid)
        .whereNull('accepted_at')
        .count('* as total')
        .first(),
    ])

    return {
      name: school.name,
      students,
      teachers,
      groups: Number(groups?.total ?? 0),
      upcomingExams: Number(exams?.total ?? 0),
      pendingInvitations: Number(invitations?.total ?? 0),
    }
  }
}

async function countByRole(schoolUuid: string, roleName: string): Promise<number> {
  const row = await db
    .from('users')
    .join('user_roles', 'users.uuid', 'user_roles.user_uuid')
    .join('roles', 'roles.uuid', 'user_roles.role_uuid')
    .where('users.school_uuid', schoolUuid)
    .where('roles.name', roleName)
    .countDistinct('users.uuid as total')
    .first()

  return Number(row?.total ?? 0)
}
