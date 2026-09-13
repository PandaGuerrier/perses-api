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
import useDialogState from '#common/ui/hooks/use_dialog_state'
import { useTranslation } from '#common/ui/hooks/use_translation'
import { urlFor } from '~/app/client'

import type { Data } from '@generated/data'

type Group = Data.Schools.Group.Variants['forList']

export function GroupsRowActions({ row }: DataTableRowActionsProps<Group>) {
  const { t } = useTranslation()
  const [open, setOpen] = useDialogState<'delete'>(null)

  const group = row.original

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.visit(urlFor('groups.show', { id: group.id }))}>
            <Users className="size-4" />
            {t('schools.groups.detail.students')}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <ModalLink href={urlFor('groups.edit', { id: group.id })}>
              <Pencil className="size-4" />
              {t('schools.action.edit_group')}
            </ModalLink>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setOpen('delete')}>
            <Trash2 className="size-4" />
            {t('schools.action.delete_group')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={open === 'delete'}
        onOpenChange={() => setOpen(null)}
        title={t('schools.action.delete_group')}
        desc={group.name}
        destructive
        handleConfirm={() => {
          setOpen(null)
          router.delete(urlFor('groups.destroy', { id: group.id }), { preserveScroll: true })
        }}
      />
    </>
  )
}
