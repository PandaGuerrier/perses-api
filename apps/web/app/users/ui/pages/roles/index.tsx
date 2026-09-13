import { ModalLink } from 'adonis-inertia-modal/react'
import { Plus } from 'lucide-react'

import type { InertiaProps } from '#core/ui/types'

import AdminLayout from '#common/ui/components/admin_layout'
import Heading from '#common/ui/components/heading'
import { Main } from '#common/ui/components/main'

import { RolesRowActions } from '#users/ui/components/roles_row_actions'

import { useTranslation } from '#common/ui/hooks/use_translation'
import { urlFor } from '~/app/client'

import { Badge } from '@workspace/ui/components/badge'
import { buttonVariants } from '@workspace/ui/components/button'
import { ColumnDef, DataTable } from '@workspace/ui/components/data-table'

import type { Data } from '@generated/data'

type Role = Data.Users.Role.Variants['forList']

type PageProps = InertiaProps<{
  roles: Role[]
  grantablePermissions: string[]
  allPermissions: string[]
}>

export default function ListRolesPage({ roles }: PageProps) {
  const { t } = useTranslation()

  const columns: ColumnDef<Role>[] = [
    {
      id: 'name',
      header: t('users.roles_screen.table.name'),
      accessorKey: 'name',
      cell: ({ row }) => <span className="font-medium capitalize">{row.original.name.replace('_', ' ')}</span>,
    },
    {
      id: 'scope',
      header: t('users.roles_screen.table.scope'),
      meta: { columnClasses: 'hidden sm:table-cell' },
      cell: ({ row }) => (
        <Badge variant={row.original.isSystem ? 'secondary' : 'outline'}>
          {row.original.isSystem
            ? t('users.roles_screen.table.system')
            : t('users.roles_screen.table.custom')}
        </Badge>
      ),
    },
    {
      id: 'permissions',
      header: t('users.roles_screen.table.permissions'),
      accessorKey: 'permissionsCount',
      meta: { columnClasses: 'hidden md:table-cell' },
    },
    {
      id: 'actions',
      meta: { columnClasses: 'w-[52px]' },
      cell: RolesRowActions,
    },
  ]

  return (
    <AdminLayout breadcrumbs={[{ label: t('users.roles_screen.page.breadcrumbs.roles') }]}>
      <Main>
        <Heading
          title={t('users.roles_screen.page.title')}
          description={t('users.roles_screen.page.description')}
        >
          <ModalLink href={urlFor('roles.create')} className={buttonVariants({ size: 'sm' })}>
            <span>{t('users.roles_screen.action.create')}</span>
            <Plus size={16} />
          </ModalLink>
        </Heading>

        <DataTable columns={columns} data={roles} t={t} />
      </Main>
    </AdminLayout>
  )
}
