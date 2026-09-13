import { useForm } from '@inertiajs/react'
import { Modal } from 'adonis-inertia-modal/react'

import type { InertiaProps } from '#core/ui/types'

import { Button } from '@workspace/ui/components/button'
import { Field, FieldGroup, FieldLabel } from '@workspace/ui/components/field'
import { FieldErrorBag } from '@workspace/ui/components/field-error-bag'
import { Input } from '@workspace/ui/components/input'
import { toast } from '@workspace/ui/hooks/use-toast'

import { useTranslation } from '#common/ui/hooks/use_translation'
import PermissionPicker from '#users/ui/components/permission_picker'
import { urlFor } from '~/app/client'

import type { Data } from '@generated/data'

type RoleFormData = { name: string; permissions: string[] }

type PageProps = InertiaProps<{
  role: Data.Users.Role.Variants['forEdit']
  grantablePermissions: string[]
}>

export default function EditRolePage({ role, grantablePermissions }: PageProps) {
  const { t } = useTranslation()

  const { data, setData, errors, put, processing } = useForm<RoleFormData>({
    name: role.name,
    permissions: role.permissions,
  })

  return (
    <Modal maxWidth="lg">
      {({ close }) => (
        <div className="space-y-4">
          <header className="space-y-1 text-left">
            <h2 className="text-lg font-semibold">{t('users.roles_screen.action.edit')}</h2>
            <p className="text-sm text-muted-foreground">
              {t('users.roles_screen.action.permissions_hint')}
            </p>
          </header>

          <form
            id="edit-role-form"
            onSubmit={(event) => {
              event.preventDefault()
              put(urlFor('roles.update', { id: role.id }), {
                preserveScroll: true,
                onSuccess: () => {
                  close()
                  toast(t('users.roles_screen.action.edit'), { description: data.name })
                },
              })
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="role-name">{t('users.roles_screen.table.name')}</FieldLabel>
                <Input
                  id="role-name"
                  value={data.name}
                  onChange={(event) => setData('name', event.target.value)}
                />
                <FieldErrorBag errors={errors} field="name" />
              </Field>

              <Field>
                <FieldLabel>{t('users.roles_screen.table.permissions')}</FieldLabel>
                <PermissionPicker
                  grantable={grantablePermissions}
                  selected={data.permissions}
                  onChange={(permissions) => setData('permissions', permissions)}
                />
                <FieldErrorBag errors={errors} field="permissions" />
              </Field>
            </FieldGroup>
          </form>

          <footer className="flex justify-end gap-2">
            <Button variant="outline" onClick={close}>
              {t('users.roles_screen.action.cancel')}
            </Button>
            <Button type="submit" form="edit-role-form" disabled={processing}>
              {t('users.roles_screen.action.save')}
            </Button>
          </footer>
        </div>
      )}
    </Modal>
  )
}
