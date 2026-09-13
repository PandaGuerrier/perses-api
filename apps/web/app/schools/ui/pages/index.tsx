import { ModalLink } from 'adonis-inertia-modal/react'
import { Plus } from 'lucide-react'

import type { InertiaProps } from '#core/ui/types'

import AdminLayout from '#common/ui/components/admin_layout'
import Heading from '#common/ui/components/heading'
import { Main } from '#common/ui/components/main'
import PaginatedTable, { type Paginated } from '#common/ui/components/paginated_table'

import { SchoolsRowActions } from '#schools/ui/components/schools_row_actions'

import useCan from '#common/ui/hooks/use_can'
import { useTranslation } from '#common/ui/hooks/use_translation'
import { urlFor } from '~/app/client'

import { buttonVariants } from '@workspace/ui/components/button'
import type { ColumnDef } from '@workspace/ui/components/data-table'

import type { Data } from '@generated/data'

type School = Data.Schools.School.Variants['forList']

type PageProps = InertiaProps<{
  schools: Paginated<School>
  q?: string
}>

export default function ListSchoolsPage({ schools, q }: PageProps) {
  const { t } = useTranslation()
  const can = useCan()

  const columns: ColumnDef<School>[] = [
    {
      id: 'name',
      header: t('schools.index.table.name'),
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="truncate font-medium">{row.original.name}</div>
          <div className="truncate text-xs text-muted-foreground">{row.original.slug}</div>
        </div>
      ),
    },
    {
      id: 'membersCount',
      header: t('schools.index.table.members'),
      accessorKey: 'membersCount',
      meta: { columnClasses: 'hidden sm:table-cell' },
    },
    {
      id: 'groupsCount',
      header: t('schools.index.table.groups'),
      accessorKey: 'groupsCount',
      meta: { columnClasses: 'hidden md:table-cell' },
    },
    {
      id: 'createdAt',
      header: t('schools.index.table.created_at'),
      accessorKey: 'createdAt',
      meta: { columnClasses: 'hidden lg:table-cell' },
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: 'actions',
      meta: { columnClasses: 'w-[52px]' },
      cell: SchoolsRowActions,
    },
  ]

  return (
    <AdminLayout breadcrumbs={[{ label: t('schools.index.page.breadcrumbs.schools') }]}>
      <Main>
        <Heading
          title={t('schools.index.page.title')}
          description={t('schools.index.page.description')}
        >
          {can.manageSchools && (
            <ModalLink href={urlFor('schools.create')} className={buttonVariants({ size: 'sm' })}>
              <span>{t('schools.action.create')}</span>
              <Plus size={16} />
            </ModalLink>
          )}
        </Heading>

        <PaginatedTable
          url="/schools"
          rows={schools}
          columns={columns}
          q={q}
          searchPlaceholder={t('schools.index.table.name')}
        />
      </Main>
    </AdminLayout>
  )
}
