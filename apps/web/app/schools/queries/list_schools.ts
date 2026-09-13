import type { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

import School from '#schools/models/school'
import { PERMISSIONS } from '#users/enums/permission'
import type User from '#users/models/user'

export interface ListSchoolsFilters {
  q?: string
}

export interface ListSchoolsPagination {
  page: number
  perPage: number
}

export default class ListSchools {
  async handle(
    viewer: User,
    filters: ListSchoolsFilters = {},
    pag: ListSchoolsPagination = { page: 1, perPage: 10 }
  ): Promise<ModelPaginatorContract<School>> {
    const query = School.query().withCount('members').withCount('groups')

    // A school admin holds `schools.view_list` too, but only ever sees their own.
    if (!(await viewer.hasPermission(PERMISSIONS.schoolsViewAny))) {
      query.where('uuid', viewer.schoolUuid ?? '00000000-0000-0000-0000-000000000000')
    }

    if (filters.q) {
      const term = `%${filters.q}%`
      query.where((sub) => sub.where('name', 'ilike', term).orWhere('slug', 'ilike', term))
    }

    query.orderBy('name', 'asc').orderBy('uuid', 'asc')

    return query.paginate(pag.page, pag.perPage)
  }
}
