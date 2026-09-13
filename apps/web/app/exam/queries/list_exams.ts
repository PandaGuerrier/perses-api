import type { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

import Exam from '#exam/models/exam'
import { PERMISSIONS } from '#users/enums/permission'
import type User from '#users/models/user'

export interface ListExamsFilters {
  q?: string
}

export interface ListExamsPagination {
  page: number
  perPage: number
}

export default class ListExams {
  async handle(
    viewer: User,
    filters: ListExamsFilters = {},
    pag: ListExamsPagination = { page: 1, perPage: 10 }
  ): Promise<ModelPaginatorContract<Exam>> {
    const query = Exam.query().preload('school').withCount('students')

    if (!(await viewer.hasPermission(PERMISSIONS.schoolsViewAny))) {
      query.where('school_uuid', viewer.schoolUuid ?? '00000000-0000-0000-0000-000000000000')
    }

    if (filters.q) {
      query.where('title', 'ilike', `%${filters.q}%`)
    }

    query.orderBy('starts_at', 'desc').orderBy('uuid', 'asc')

    return query.paginate(pag.page, pag.perPage)
  }
}
