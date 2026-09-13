import { BasePolicy } from '@adonisjs/bouncer'
import { type AuthorizerResponse } from '@adonisjs/bouncer/types'

import type School from '#schools/models/school'
import { PERMISSIONS } from '#users/enums/permission'
import { scopedTo } from '#users/policies/scope'
import type User from '#users/models/user'

export default class MemberPolicy extends BasePolicy {
  async viewList(currentUser: User, school: School): Promise<AuthorizerResponse> {
    if (!(await currentUser.hasPermission(PERMISSIONS.schoolMembersViewList))) return false
    return scopedTo(currentUser, school.uuid)
  }

  async invite(currentUser: User, school: School): Promise<AuthorizerResponse> {
    if (!(await currentUser.hasPermission(PERMISSIONS.schoolMembersInvite))) return false
    return scopedTo(currentUser, school.uuid)
  }

  async remove(currentUser: User, school: School, member: User): Promise<AuthorizerResponse> {
    if (currentUser.uuid === member.uuid) return false
    if (!(await currentUser.hasPermission(PERMISSIONS.schoolMembersRemove))) return false
    return (await scopedTo(currentUser, school.uuid)) && member.schoolUuid === school.uuid
  }

  async manageRoles(currentUser: User, school: School): Promise<AuthorizerResponse> {
    if (!(await currentUser.hasPermission(PERMISSIONS.schoolMembersManageRoles))) return false
    return scopedTo(currentUser, school.uuid)
  }
}
