import { BasePolicy } from '@adonisjs/bouncer'
import { type AuthorizerResponse } from '@adonisjs/bouncer/types'

import type Exam from '#exam/models/exam'
import { PERMISSIONS } from '#users/enums/permission'
import { scopedTo } from '#users/policies/scope'
import type User from '#users/models/user'

export default class ExamPolicy extends BasePolicy {
  async viewList(currentUser: User): Promise<AuthorizerResponse> {
    return currentUser.hasPermission(PERMISSIONS.examsViewList)
  }

  async view(currentUser: User, exam: Exam): Promise<AuthorizerResponse> {
    if (!(await currentUser.hasPermission(PERMISSIONS.examsViewList))) return false
    return scopedTo(currentUser, exam.schoolUuid)
  }

  /**
   * The stock `teacher` role does not carry `exams.create`; an admin grants it
   * through a school-scoped custom role.
   */
  async create(currentUser: User): Promise<AuthorizerResponse> {
    if (!(await currentUser.hasPermission(PERMISSIONS.examsCreate))) return false
    return currentUser.schoolUuid !== null
  }

  async update(currentUser: User, exam: Exam): Promise<AuthorizerResponse> {
    if (!(await currentUser.hasPermission(PERMISSIONS.examsUpdate))) return false
    return scopedTo(currentUser, exam.schoolUuid)
  }

  async delete(currentUser: User, exam: Exam): Promise<AuthorizerResponse> {
    if (!(await currentUser.hasPermission(PERMISSIONS.examsDelete))) return false
    return scopedTo(currentUser, exam.schoolUuid)
  }

  async viewSchedule(currentUser: User): Promise<AuthorizerResponse> {
    return currentUser.hasPermission(PERMISSIONS.examsViewSchedule)
  }
}
