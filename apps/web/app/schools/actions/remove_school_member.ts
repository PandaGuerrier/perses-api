import type School from '#schools/models/school'
import type User from '#users/models/user'

export interface RemoveSchoolMemberInput {
  school: School
  member: User
}

export default class RemoveSchoolMember {
  async handle({ school, member }: RemoveSchoolMemberInput): Promise<void> {
    // Leaving the school also leaves every class inside it.
    const groups = await member.related('groups').query().where('school_uuid', school.uuid)
    await member.related('groups').detach(groups.map((group) => group.uuid))

    member.schoolUuid = null
    await member.save()
  }
}
