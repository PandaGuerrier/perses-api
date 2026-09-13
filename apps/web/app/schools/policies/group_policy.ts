import { BasePolicy } from '@adonisjs/bouncer'
import { type AuthorizerResponse } from '@adonisjs/bouncer/types'

import type Group from '#schools/models/group'
import { PERMISSIONS } from '#users/enums/permission'
import { scopedTo } from '#users/policies/scope'
import type User from '#users/models/user'

export default class GroupPolicy extends BasePolicy {
  async viewList(currentUser: User): Promise<AuthorizerResponse> {
    return currentUser.hasPermission(PERMISSIONS.groupsViewList)
  }

  async view(currentUser: User, group: Group): Promise<AuthorizerResponse> {
    if (!(await currentUser.hasPermission(PERMISSIONS.groupsViewList))) return false
    return scopedTo(currentUser, group.schoolUuid)
  }

  async create(currentUser: User): Promise<AuthorizerResponse> {
    if (!(await currentUser.hasPermission(PERMISSIONS.groupsCreate))) return false
    // A group has to land in some school, and a super-admin belongs to none.
    return currentUser.schoolUuid !== null
  }

  async update(currentUser: User, group: Group): Promise<AuthorizerResponse> {
    if (!(await currentUser.hasPermission(PERMISSIONS.groupsUpdate))) return false
    return scopedTo(currentUser, group.schoolUuid)
  }

  async delete(currentUser: User, group: Group): Promise<AuthorizerResponse> {
    if (!(await currentUser.hasPermission(PERMISSIONS.groupsDelete))) return false
    return scopedTo(currentUser, group.schoolUuid)
  }

  async manageMembers(currentUser: User, group: Group): Promise<AuthorizerResponse> {
    if (!(await currentUser.hasPermission(PERMISSIONS.groupsManageMembers))) return false
    return scopedTo(currentUser, group.schoolUuid)
  }
}
