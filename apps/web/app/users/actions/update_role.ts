import { assertGrantablePermissions } from '#users/actions/sync_user_roles'
import type { Permission } from '#users/enums/permission'
import type Role from '#users/models/role'
import type User from '#users/models/user'

export interface UpdateRoleInput {
  target: Role
  name: string
  permissions: Permission[]
  executor: User
}

export default class UpdateRole {
  async handle(input: UpdateRoleInput): Promise<Role> {
    await assertGrantablePermissions(input.executor, input.permissions)

    input.target.merge({ name: input.name, permissions: input.permissions })
    await input.target.save()

    return input.target
  }
}
