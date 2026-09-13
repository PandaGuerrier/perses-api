import { router } from '@inertiajs/react'
import { ModalLink } from 'adonis-inertia-modal/react'
import { MoreHorizontal, Pencil, Trash2, Users } from 'lucide-react'

import { Button } from '@workspace/ui/components/button'
import type { DataTableRowActionsProps } from '@workspace/ui/components/data-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'

import { ConfirmDialog } from '#common/ui/components/confirm_dialog'
import useCan from '#common/ui/hooks/use_can'
import useDialogState from '#common/ui/hooks/use_dialog_state'
import { useTranslation } from '#common/ui/hooks/use_translation'
import { urlFor } from '~/app/client'

import type { Data } from '@generated/data'

type School = Data.Schools.School.Variants['forList']

export function SchoolsRowActions({ row }: DataTableRowActionsProps<School>) {
  const { t } = useTranslation()
  const can = useCan()
  const [open, setOpen] = useDialogState<'delete'>(null)

  const school = row.original

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {can.manageMembers && (
            <DropdownMenuItem
              onClick={() =>
                router.visit(urlFor('schools.members.index', { school_id: school.id }))
              }
            >
              <Users className="size-4" />
              {t('schools.members.page.title')}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <ModalLink href={urlFor('schools.edit', { id: school.id })}>
              <Pencil className="size-4" />
              {t('schools.action.edit')}
            </ModalLink>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setOpen('delete')}>
            <Trash2 className="size-4" />
            {t('schools.action.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={open === 'delete'}
        onOpenChange={() => setOpen(null)}
        title={t('schools.action.delete')}
        desc={school.name}
        destructive
        handleConfirm={() => {
          setOpen(null)
          router.delete(urlFor('schools.destroy', { id: school.id }), { preserveScroll: true })
        }}
      />
    </>
  )
}
