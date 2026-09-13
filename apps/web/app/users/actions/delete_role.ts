import type Role from '#users/models/role'

export interface DeleteRoleInput {
  target: Role
}

export default class DeleteRole {
  async handle({ target }: DeleteRoleInput): Promise<void> {
    await target.delete()
  }
}
