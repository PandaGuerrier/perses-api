import { ROLES } from '#users/enums/role'
import User from '#users/models/user'

export interface ListGroupCandidatesInput {
  schoolUuid: string
  groupUuid: string
}

/** Students of the school who are not in the group yet. */
export default class ListGroupCandidates {
  async handle({ schoolUuid, groupUuid }: ListGroupCandidatesInput): Promise<User[]> {
    return User.query()
      .where('school_uuid', schoolUuid)
      .whereHas('roles', (roles) => roles.where('name', ROLES.STUDENT))
      .whereDoesntHave('groups', (groups) => groups.where('groups.uuid', groupUuid))
      .orderBy('full_name', 'asc')
      .orderBy('uuid', 'asc')
  }
}
