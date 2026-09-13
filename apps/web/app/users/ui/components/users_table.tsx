import { router } from '@inertiajs/react'
import React from 'react'

import {
  ColumnDef,
  DataTable,
  type OnChangeFn,
  type SortingState,
} from '@workspace/ui/components/data-table'
import { Badge } from '@workspace/ui/components/badge'
import { Input } from '@workspace/ui/components/input'
import { useDataTable } from '@workspace/ui/hooks/use-data-table'

import { useTranslation } from '#common/ui/hooks/use_translation'
import { DataTableRowActions } from '#users/ui/components/users_row_actions'

import type { SortDirection, UsersSortBy } from '#users/enums/sort'

import type { Data } from '@generated/data'

type User = Data.Users.User.Variants['forList']

interface DataTableProps {
  users: {
    data: User[]
    metadata: {
      total: number
      perPage: number
      currentPage: number
      lastPage: number
      firstPage: number
      firstPageUrl?: string
      lastPageUrl?: string
      nextPageUrl?: string | null
      previousPageUrl?: string | null
    }
  }
  q: string | undefined
  sort: string | null
  order: string | null
}

export default function UsersTable({ users, q, sort, order }: DataTableProps) {
  const { t } = useTranslation()

  const [querySearch, setQuerySearch] = React.useState(q || '')

  const sorting = React.useMemo<SortingState>(
    () => (sort && order ? [{ id: sort, desc: order === 'desc' }] : []),
    [sort, order]
  )

  const onSortingChange = React.useCallback<OnChangeFn<SortingState>>(
    (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater
      const first = next[0]
      const nextSort = (first?.id ?? undefined) as UsersSortBy | undefined
      const nextOrder: SortDirection | undefined = first ? (first.desc ? 'desc' : 'asc') : undefined

      router.get(
        '/users',
        {
          q: querySearch.length > 0 ? querySearch : undefined,
          perPage: users.metadata.perPage,
          sort: nextSort,
          order: nextOrder,
        },
        {
          preserveState: true,
          preserveScroll: true,
          replace: true,
          only: ['users', 'sort', 'order'],
        }
      )
    },
    [sorting, querySearch, users.metadata.perPage]
  )

  const remoteTableOptions = useDataTable({
    data: users,
    visit: ({ page, perPage }) =>
      router.get(
        '/users',
        {
          page,
          perPage,
          q: querySearch.length > 0 ? querySearch : undefined,
          sort: sort ?? undefined,
          order: order ?? undefined,
        },
        { preserveState: true, preserveScroll: true, replace: true }
      ),
    sorting: { state: sorting, onChange: onSortingChange },
  })

  const columns: ColumnDef<User>[] = [
    {
      id: 'fullName',
      header: t('users.index.table.columns.full_name'),
      accessorKey: 'fullName',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="truncate font-medium">
            {row.original.fullName ? (
              row.original.fullName
            ) : (
              <span className="italic text-muted-foreground">
                {t('users.index.table.not_provided')}
              </span>
            )}
          </div>
          <div className="truncate text-xs text-muted-foreground sm:hidden">
            {row.original.email}
          </div>
        </div>
      ),
    },
    {
      id: 'email',
      header: t('users.index.table.columns.email'),
      accessorKey: 'email',
      enableSorting: true,
      meta: { columnClasses: 'hidden sm:table-cell' },
    },
    {
      // Roles are rows now, not an enum — a user can carry a system role plus
      // any number of school-scoped custom ones, so they all get a badge.
      id: 'roles',
      header: t('users.index.table.columns.role'),
      enableSorting: false,
      meta: { columnClasses: 'hidden md:table-cell' },
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.roles.map((role) => (
            <Badge key={role} variant="secondary" className="capitalize">
              {role.replace('_', ' ')}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: 'createdAt',
      header: t('users.index.table.columns.created_at'),
      accessorKey: 'createdAt',
      enableSorting: true,
      meta: { columnClasses: 'hidden lg:table-cell' },
      cell: ({ row }) =>
        row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : null,
    },
    {
      id: 'actions',
      enableSorting: false,
      meta: { columnClasses: 'w-[52px]' },
      cell: DataTableRowActions,
    },
  ]

  return (
    <div className="space-y-4">
      <Input
        value={querySearch}
        placeholder={t('users.index.table.columns.email')}
        className="h-9 w-full max-w-sm"
        onChange={(event) => setQuerySearch(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            router.get(
              '/users',
              { q: querySearch.length > 0 ? querySearch : undefined },
              { preserveState: true, preserveScroll: true, replace: true }
            )
          }
        }}
      />
      <DataTable columns={columns} data={users.data} t={t} remoteTableOptions={remoteTableOptions} />
    </div>
  )
}
