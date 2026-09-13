import { BasePolicy } from '@adonisjs/bouncer'
import { type AuthorizerResponse } from '@adonisjs/bouncer/types'

import type School from '#schools/models/school'
import { PERMISSIONS } from '#users/enums/permission'
import { scopedTo } from '#users/policies/scope'
import type User from '#users/models/user'

export default class SchoolPolicy extends BasePolicy {
  async viewList(currentUser: User): Promise<AuthorizerResponse> {
    return currentUser.hasPermission(PERMISSIONS.schoolsViewList)
  }

  async view(currentUser: User, school: School): Promise<AuthorizerResponse> {
    if (!(await currentUser.hasPermission(PERMISSIONS.schoolsViewList))) return false
    return scopedTo(currentUser, school.uuid)
  }

  async create(currentUser: User): Promise<AuthorizerResponse> {
    return currentUser.hasPermission(PERMISSIONS.schoolsCreate)
  }

  async update(currentUser: User, school: School): Promise<AuthorizerResponse> {
    if (!(await currentUser.hasPermission(PERMISSIONS.schoolsUpdate))) return false
    return scopedTo(currentUser, school.uuid)
  }

  async delete(currentUser: User): Promise<AuthorizerResponse> {
    // Dropping a school cascades to its groups, invitations and exams, so it
    // stays a platform-wide act even for an admin who owns `schools.delete`.
    if (!(await currentUser.hasPermission(PERMISSIONS.schoolsDelete))) return false
    return currentUser.hasPermission(PERMISSIONS.schoolsViewAny)
  }
}
