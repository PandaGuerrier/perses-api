import { ModalLink } from 'adonis-inertia-modal/react'
import { Plus } from 'lucide-react'

import type { InertiaProps } from '#core/ui/types'

import AdminLayout from '#common/ui/components/admin_layout'
import Heading from '#common/ui/components/heading'
import { Main } from '#common/ui/components/main'
import PaginatedTable, { type Paginated } from '#common/ui/components/paginated_table'

import { GroupsRowActions } from '#schools/ui/components/groups_row_actions'

import { useTranslation } from '#common/ui/hooks/use_translation'
import { urlFor } from '~/app/client'

import { buttonVariants } from '@workspace/ui/components/button'
import type { ColumnDef } from '@workspace/ui/components/data-table'

import type { Data } from '@generated/data'

type Group = Data.Schools.Group.Variants['forList']

type PageProps = InertiaProps<{
  groups: Paginated<Group>
  q?: string
}>

export default function ListGroupsPage({ groups, q }: PageProps) {
  const { t } = useTranslation()

  const columns: ColumnDef<Group>[] = [
    {
      id: 'name',
      header: t('schools.groups.table.name'),
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="truncate font-medium">{row.original.name}</div>
          <div className="truncate text-xs text-muted-foreground">{row.original.slug}</div>
        </div>
      ),
    },
    {
      id: 'schoolName',
      header: t('schools.groups.table.school'),
      accessorKey: 'schoolName',
      meta: { columnClasses: 'hidden md:table-cell' },
    },
    {
      id: 'studentsCount',
      header: t('schools.groups.table.students'),
      accessorKey: 'studentsCount',
      meta: { columnClasses: 'hidden sm:table-cell' },
    },
    {
      id: 'createdAt',
      header: t('schools.groups.table.created_at'),
      accessorKey: 'createdAt',
      meta: { columnClasses: 'hidden lg:table-cell' },
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: 'actions',
      meta: { columnClasses: 'w-[52px]' },
      cell: GroupsRowActions,
    },
  ]

  return (
    <AdminLayout breadcrumbs={[{ label: t('schools.groups.page.breadcrumbs.groups') }]}>
      <Main>
        <Heading
          title={t('schools.groups.page.title')}
          description={t('schools.groups.page.description')}
        >
          <ModalLink href={urlFor('groups.create')} className={buttonVariants({ size: 'sm' })}>
            <span>{t('schools.action.create_group')}</span>
            <Plus size={16} />
          </ModalLink>
        </Heading>

        <PaginatedTable
          url="/groups"
          rows={groups}
          columns={columns}
          q={q}
          searchPlaceholder={t('schools.groups.table.name')}
        />
      </Main>
    </AdminLayout>
  )
}
