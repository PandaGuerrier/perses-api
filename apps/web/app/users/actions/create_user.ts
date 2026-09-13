import SyncUserRoles from '#users/actions/sync_user_roles'
import User from '#users/models/user'

export interface CreateUserInput {
  fullName: string
  email: string
  roleUuids: string[]
  schoolUuid: string | null
  executor: User
}

export default class CreateUser {
  async handle(input: CreateUserInput): Promise<User> {
    const user = new User()
    user.merge({
      fullName: input.fullName,
      email: input.email,
      schoolUuid: input.schoolUuid,
    })
    await user.save()

    await new SyncUserRoles().handle({
      target: user,
      desiredRoleUuids: input.roleUuids,
      executor: input.executor,
    })

    return user
  }
}
