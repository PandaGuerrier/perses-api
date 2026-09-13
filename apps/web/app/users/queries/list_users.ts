import type { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

import { USERS_SORT_COLUMN, type SortDirection, type UsersSortBy } from '#users/enums/sort'
import User from '#users/models/user'

export interface ListUsersFilters {
  q?: string
  roles?: string[]
  /** null keeps the query platform-wide; a uuid restricts it to one school. */
  schoolUuid?: string | null
  sort?: UsersSortBy
  order?: SortDirection
}

export interface ListUsersPagination {
  page: number
  perPage: number
}

export default class ListUsers {
  async handle(
    filters: ListUsersFilters = {},
    pag: ListUsersPagination = { page: 1, perPage: 10 }
  ): Promise<ModelPaginatorContract<User>> {
    const query = User.query().preload('roles').preload('school')

    if (filters.schoolUuid) {
      query.where('school_uuid', filters.schoolUuid)
    }

    if (filters.q) {
      const term = `%${filters.q}%`
      query.where((sub) => {
        sub.where('full_name', 'ilike', term).orWhere('email', 'ilike', term)
      })
    }

    if (filters.roles && filters.roles.length > 0) {
      query.whereHas('roles', (rolesQuery) => rolesQuery.whereIn('name', filters.roles!))
    }

    // Tiebreaker: without `uuid asc` a shared sorted value can swap pages between requests.
    if (filters.sort) {
      query.orderBy(USERS_SORT_COLUMN[filters.sort], filters.order ?? 'asc')
    } else {
      query.orderBy('created_at', 'desc')
    }
    query.orderBy('uuid', 'asc')

    return query.paginate(pag.page, pag.perPage)
  }
}
