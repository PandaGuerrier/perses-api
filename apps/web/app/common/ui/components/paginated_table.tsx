import { router } from '@inertiajs/react'
import React from 'react'

import { ColumnDef, DataTable } from '@workspace/ui/components/data-table'
import { Input } from '@workspace/ui/components/input'
import { useDataTable, type PaginatorMeta } from '@workspace/ui/hooks/use-data-table'

import { useTranslation } from '#common/ui/hooks/use_translation'

export type Paginated<T> = {
  data: T[]
  metadata: PaginatorMeta
}

interface PaginatedTableProps<T> {
  /** Inertia URL the pagination and the search box navigate back to. */
  url: string
  rows: Paginated<T>
  columns: ColumnDef<T>[]
  q?: string
  searchPlaceholder?: string
  /** Extra query params to carry through pagination and search. */
  params?: Record<string, unknown>
}

/**
 * The list screens differ only in their columns, so the server-driven
 * pagination plumbing lives here once. `users` keeps its own table because it
 * also carries faceted role filters.
 */
export default function PaginatedTable<T>({
  url,
  rows,
  columns,
  q,
  searchPlaceholder,
  params = {},
}: PaginatedTableProps<T>) {
  const { t } = useTranslation()
  const [search, setSearch] = React.useState(q ?? '')

  const visit = React.useCallback(
    (page: number, perPage: number, term: string) => {
      router.get(
        url,
        { ...params, page, perPage, q: term.length > 0 ? term : undefined },
        { preserveState: true, preserveScroll: true, replace: true }
      )
    },
    [url, params]
  )

  const remoteTableOptions = useDataTable({
    data: rows,
    visit: ({ page, perPage }) => visit(page, perPage, search),
  })

  return (
    <div className="space-y-4">
      {searchPlaceholder && (
        <Input
          value={search}
          placeholder={searchPlaceholder}
          className="h-9 w-full max-w-sm"
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') visit(1, rows.metadata.perPage, search)
          }}
        />
      )}
      <DataTable columns={columns} data={rows.data} t={t} remoteTableOptions={remoteTableOptions} />
    </div>
  )
}
