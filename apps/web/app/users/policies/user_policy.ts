import { BasePolicy } from '@adonisjs/bouncer'
import { type AuthorizerResponse } from '@adonisjs/bouncer/types'

import { PERMISSIONS } from '#users/enums/permission'
import { scopedTo } from '#users/policies/scope'
import type User from '#users/models/user'

export default class UserPolicy extends BasePolicy {
  async viewList(currentUser: User): Promise<AuthorizerResponse> {
    return currentUser.hasPermission(PERMISSIONS.usersViewList)
  }

  async view(currentUser: User, user: User): Promise<AuthorizerResponse> {
    if (currentUser.uuid === user.uuid) return true
    if (!(await currentUser.hasPermission(PERMISSIONS.usersViewList))) return false
    return scopedTo(currentUser, user.schoolUuid)
  }

  async create(currentUser: User): Promise<AuthorizerResponse> {
    return currentUser.hasPermission(PERMISSIONS.usersViewAny)
  }

  async update(currentUser: User, user: User): Promise<AuthorizerResponse> {
    if (!(await currentUser.hasPermission(PERMISSIONS.usersUpdate))) return false
    return scopedTo(currentUser, user.schoolUuid)
  }

  async delete(currentUser: User, user: User): Promise<AuthorizerResponse> {
    // Deleting yourself would leave the session pointing at a missing row.
    if (currentUser.uuid === user.uuid) return false
    if (!(await currentUser.hasPermission(PERMISSIONS.usersDelete))) return false
    return scopedTo(currentUser, user.schoolUuid)
  }
}
