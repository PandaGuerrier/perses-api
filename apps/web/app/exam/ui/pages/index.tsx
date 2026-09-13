import { ModalLink } from 'adonis-inertia-modal/react'
import { Plus } from 'lucide-react'

import type { InertiaProps } from '#core/ui/types'

import AdminLayout from '#common/ui/components/admin_layout'
import Heading from '#common/ui/components/heading'
import { Main } from '#common/ui/components/main'
import PaginatedTable, { type Paginated } from '#common/ui/components/paginated_table'

import { ExamsRowActions } from '#exam/ui/components/exams_row_actions'

import { useTranslation } from '#common/ui/hooks/use_translation'
import { urlFor } from '~/app/client'

import { buttonVariants } from '@workspace/ui/components/button'
import type { ColumnDef } from '@workspace/ui/components/data-table'

import type { Data } from '@generated/data'

type Exam = Data.Exam.Exam.Variants['forList']

type PageProps = InertiaProps<{
  exams: Paginated<Exam>
  q?: string
}>

const formatDateTime = (iso: string) => new Date(iso).toLocaleString()

export default function ListExamsPage({ exams, q }: PageProps) {
  const { t } = useTranslation()

  const columns: ColumnDef<Exam>[] = [
    {
      id: 'title',
      header: t('exam.index.table.title'),
      accessorKey: 'title',
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="truncate font-medium">{row.original.title}</div>
          <div className="truncate text-xs text-muted-foreground sm:hidden">
            {formatDateTime(row.original.startsAt)}
          </div>
        </div>
      ),
    },
    {
      id: 'startsAt',
      header: t('exam.index.table.starts_at'),
      meta: { columnClasses: 'hidden sm:table-cell' },
      cell: ({ row }) => formatDateTime(row.original.startsAt),
    },
    {
      id: 'endsAt',
      header: t('exam.index.table.ends_at'),
      meta: { columnClasses: 'hidden lg:table-cell' },
      cell: ({ row }) => formatDateTime(row.original.endsAt),
    },
    {
      id: 'studentsCount',
      header: t('exam.index.table.students'),
      accessorKey: 'studentsCount',
      meta: { columnClasses: 'hidden md:table-cell' },
    },
    {
      id: 'actions',
      meta: { columnClasses: 'w-[52px]' },
      cell: ExamsRowActions,
    },
  ]

  return (
    <AdminLayout breadcrumbs={[{ label: t('exam.index.page.breadcrumbs.exams') }]}>
      <Main>
        <Heading title={t('exam.index.page.title')} description={t('exam.index.page.description')}>
          <ModalLink href={urlFor('exams.create')} className={buttonVariants({ size: 'sm' })}>
            <span>{t('exam.action.create')}</span>
            <Plus size={16} />
          </ModalLink>
        </Heading>

        <PaginatedTable
          url="/exams"
          rows={exams}
          columns={columns}
          q={q}
          searchPlaceholder={t('exam.index.table.title')}
        />
      </Main>
    </AdminLayout>
  )
}
