import type { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

import Group from '#schools/models/group'
import { PERMISSIONS } from '#users/enums/permission'
import type User from '#users/models/user'

export interface ListGroupsFilters {
  q?: string
}

export interface ListGroupsPagination {
  page: number
  perPage: number
}

export default class ListGroups {
  async handle(
    viewer: User,
    filters: ListGroupsFilters = {},
    pag: ListGroupsPagination = { page: 1, perPage: 10 }
  ): Promise<ModelPaginatorContract<Group>> {
    const query = Group.query().preload('school').withCount('students')

    if (!(await viewer.hasPermission(PERMISSIONS.schoolsViewAny))) {
      query.where('school_uuid', viewer.schoolUuid ?? '00000000-0000-0000-0000-000000000000')
    }

    if (filters.q) {
      const term = `%${filters.q}%`
      query.where((sub) => sub.where('name', 'ilike', term).orWhere('slug', 'ilike', term))
    }

    query.orderBy('name', 'asc').orderBy('uuid', 'asc')

    return query.paginate(pag.page, pag.perPage)
  }
}
