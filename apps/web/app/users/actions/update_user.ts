import SyncUserRoles from '#users/actions/sync_user_roles'
import type User from '#users/models/user'

export interface UpdateUserInput {
  target: User
  fullName: string
  email: string
  roleUuids: string[]
  schoolUuid: string | null
  executor: User
}

export default class UpdateUser {
  async handle(input: UpdateUserInput): Promise<User> {
    input.target.merge({
      fullName: input.fullName,
      email: input.email,
      schoolUuid: input.schoolUuid,
    })
    await input.target.save()

    await new SyncUserRoles().handle({
      target: input.target,
      desiredRoleUuids: input.roleUuids,
      executor: input.executor,
    })

    return input.target
  }
}
