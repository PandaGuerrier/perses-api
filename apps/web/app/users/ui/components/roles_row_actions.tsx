import { router } from '@inertiajs/react'
import { ModalLink } from 'adonis-inertia-modal/react'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

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

type Role = Data.Users.Role.Variants['forList']

export function RolesRowActions({ row }: DataTableRowActionsProps<Role>) {
  const { t } = useTranslation()
  const [open, setOpen] = useDialogState<'delete'>(null)

  const role = row.original

  // The built-in roles are the contract the app is seeded against.
  if (role.isSystem) return null

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <ModalLink href={urlFor('roles.edit', { id: role.id })}>
              <Pencil className="size-4" />
              {t('users.roles_screen.action.edit')}
            </ModalLink>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setOpen('delete')}>
            <Trash2 className="size-4" />
            {t('users.roles_screen.action.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={open === 'delete'}
        onOpenChange={() => setOpen(null)}
        title={t('users.roles_screen.action.delete')}
        desc={role.name}
        destructive
        handleConfirm={() => {
          setOpen(null)
          router.delete(urlFor('roles.destroy', { id: role.id }), { preserveScroll: true })
        }}
      />
    </>
  )
}
