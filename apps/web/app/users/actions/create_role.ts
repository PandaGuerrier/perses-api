import { assertGrantablePermissions } from '#users/actions/sync_user_roles'
import RoleAlreadyExistsException from '#users/exceptions/role_already_exists'
import type { Permission } from '#users/enums/permission'
import Role from '#users/models/role'
import type User from '#users/models/user'

export interface CreateRoleInput {
  name: string
  permissions: Permission[]
  executor: User
}

export default class CreateRole {
  async handle(input: CreateRoleInput): Promise<Role> {
    await assertGrantablePermissions(input.executor, input.permissions)

    const schoolUuid = input.executor.schoolUuid
    const existing = await Role.query()
      .where('name', input.name)
      .where((sub) =>
        schoolUuid ? sub.where('school_uuid', schoolUuid) : sub.whereNull('school_uuid')
      )
      .first()
    if (existing) throw new RoleAlreadyExistsException(input.name)

    return Role.create({
      name: input.name,
      permissions: input.permissions,
      schoolUuid,
      isSystem: false,
    })
  }
}
