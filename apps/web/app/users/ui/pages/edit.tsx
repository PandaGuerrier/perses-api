import { useForm } from '@inertiajs/react'
import { Modal } from 'adonis-inertia-modal/react'

import { Button } from '@workspace/ui/components/button'
import { toast } from '@workspace/ui/hooks/use-toast'

import { urlFor } from '~/app/client'

import { useTranslation } from '#common/ui/hooks/use_translation'
import UserFormFields, { type UserFormData } from '#users/ui/components/user_form_fields'

import type { InertiaProps } from '#core/ui/types'
import type { Data } from '@generated/data'

type PageProps = InertiaProps<{
  user: Data.Users.User.Variants['forEdit']
  roles: Data.Users.Role.Variants['forList'][]
}>

export default function EditUserPage({ user, roles }: PageProps) {
  const { t } = useTranslation()

  const { data, setData, errors, put, processing } = useForm<UserFormData>({
    fullName: user.fullName ?? '',
    email: user.email,
    // The user carries role names; the form submits role ids.
    roles: roles.filter((role) => user.roles.includes(role.name)).map((role) => role.id),
  })

  return (
    <Modal maxWidth="md">
      {({ close }) => (
        <div className="space-y-4">
          <header className="space-y-1 text-left">
            <h2 className="text-lg font-semibold">{t('users.action.edit.title')}</h2>
            <p className="text-sm text-muted-foreground">{t('users.action.edit.description')}</p>
          </header>

          <form
            id="edit-user-form"
            onSubmit={(event) => {
              event.preventDefault()
              put(urlFor('users.update', { id: user.id }), {
                preserveScroll: true,
                onSuccess: () => {
                  close()
                  toast(t('users.action.toast.title'), { description: data.email })
                },
              })
            }}
          >
            <UserFormFields
              data={data}
              errors={errors}
              setData={(key, value) => setData(key, value as never)}
              roles={roles}
            />
          </form>

          <footer className="flex justify-end gap-2">
            <Button variant="outline" onClick={close}>
              {t('users.action.actions.cancel')}
            </Button>
            <Button type="submit" form="edit-user-form" disabled={processing}>
              {t('users.action.actions.save')}
            </Button>
          </footer>
        </div>
      )}
    </Modal>
  )
}
