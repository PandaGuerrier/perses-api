import db from '@adonisjs/lucid/services/db'

import School from '#schools/models/school'

// A read model returns a `type`, never an `interface`: Inertia's
// InertiaProps<T extends JSONDataTypes> needs the index signature.
export type PlatformOverview = {
  schools: number
  users: number
  pendingInvitations: number
  latestSchools: {
    id: string
    name: string
    slug: string
    membersCount: number
    groupsCount: number
  }[]
}

export default class GetPlatformOverview {
  async handle(): Promise<PlatformOverview> {
    const [schools, users, invitations, latest] = await Promise.all([
      db.from('schools').count('* as total').first(),
      db.from('users').count('* as total').first(),
      db.from('school_invitations').whereNull('accepted_at').count('* as total').first(),
      School.query()
        .withCount('members')
        .withCount('groups')
        .orderBy('created_at', 'desc')
        .orderBy('uuid', 'asc')
        .limit(5),
    ])

    return {
      schools: Number(schools?.total ?? 0),
      users: Number(users?.total ?? 0),
      pendingInvitations: Number(invitations?.total ?? 0),
      latestSchools: latest.map((school) => ({
        id: school.uuid,
        name: school.name,
        slug: school.slug,
        membersCount: Number(school.$extras.members_count ?? 0),
        groupsCount: Number(school.$extras.groups_count ?? 0),
      })),
    }
  }
}
