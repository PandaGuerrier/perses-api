import { BasePolicy } from '@adonisjs/bouncer'
import { type AuthorizerResponse } from '@adonisjs/bouncer/types'

import { PERMISSIONS } from '#users/enums/permission'
import { scopedTo } from '#users/policies/scope'
import type Role from '#users/models/role'
import type User from '#users/models/user'

export default class RolePolicy extends BasePolicy {
  async viewList(currentUser: User): Promise<AuthorizerResponse> {
    return currentUser.hasPermission(PERMISSIONS.rolesViewList)
  }

  async create(currentUser: User): Promise<AuthorizerResponse> {
    return currentUser.hasPermission(PERMISSIONS.rolesCreate)
  }

  async update(currentUser: User, role: Role): Promise<AuthorizerResponse> {
    // The four built-in roles are the contract the whole app is seeded against.
    if (role.isSystem) return false
    if (!(await currentUser.hasPermission(PERMISSIONS.rolesUpdate))) return false
    return scopedTo(currentUser, role.schoolUuid)
  }

  async delete(currentUser: User, role: Role): Promise<AuthorizerResponse> {
    if (role.isSystem) return false
    if (!(await currentUser.hasPermission(PERMISSIONS.rolesDelete))) return false
    return scopedTo(currentUser, role.schoolUuid)
  }
}
