import type { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

import { USERS_SORT_COLUMN, type SortDirection, type UsersSortBy } from '#users/enums/sort'
import User from '#users/models/user'

export interface ListSchoolMembersFilters {
  schoolUuid: string
  q?: string
  roles?: string[]
  sort?: UsersSortBy
  order?: SortDirection
}

export interface ListSchoolMembersPagination {
  page: number
  perPage: number
}

export default class ListSchoolMembers {
  async handle(
    filters: ListSchoolMembersFilters,
    pag: ListSchoolMembersPagination = { page: 1, perPage: 10 }
  ): Promise<ModelPaginatorContract<User>> {
    const query = User.query().where('school_uuid', filters.schoolUuid).preload('roles')

    if (filters.q) {
      const term = `%${filters.q}%`
      query.where((sub) => {
        sub.where('full_name', 'ilike', term).orWhere('email', 'ilike', term)
      })
    }

    if (filters.roles && filters.roles.length > 0) {
      query.whereHas('roles', (rolesQuery) => rolesQuery.whereIn('name', filters.roles!))
    }

    if (filters.sort) {
      query.orderBy(USERS_SORT_COLUMN[filters.sort], filters.order ?? 'asc')
    } else {
      query.orderBy('created_at', 'desc')
    }
    // Tiebreaker: shared sort values would otherwise swap between pages.
    query.orderBy('uuid', 'asc')

    return query.paginate(pag.page, pag.perPage)
  }
}
