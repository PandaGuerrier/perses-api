import { useForm } from '@inertiajs/react'
import { Modal } from 'adonis-inertia-modal/react'

import type { InertiaProps } from '#core/ui/types'

import { Button } from '@workspace/ui/components/button'
import { toast } from '@workspace/ui/hooks/use-toast'

import { urlFor } from '~/app/client'
import { useTranslation } from '#common/ui/hooks/use_translation'
import UserFormFields, { type UserFormData } from '#users/ui/components/user_form_fields'

import type { Data } from '@generated/data'

type PageProps = InertiaProps<{
  roles: Data.Users.Role.Variants['forList'][]
}>

export default function CreateUserPage({ roles }: PageProps) {
  const { t } = useTranslation()

  const { data, setData, errors, post, processing, reset } = useForm<UserFormData>({
    fullName: '',
    email: '',
    roles: [],
  })

  return (
    <Modal maxWidth="md">
      {({ close }) => (
        <div className="space-y-4">
          <header className="space-y-1 text-left">
            <h2 className="text-lg font-semibold">{t('users.action.create.title')}</h2>
            <p className="text-sm text-muted-foreground">
              {t('users.action.create.description')}
            </p>
          </header>

          <form
            id="create-user-form"
            onSubmit={(event) => {
              event.preventDefault()
              post(urlFor('users.store'), {
                preserveScroll: true,
                onSuccess: () => {
                  close()
                  toast(t('users.action.toast.title'), {
                    description: data.fullName || data.email,
                  })
                },
                onFinish: () => reset(),
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
            <Button type="submit" form="create-user-form" disabled={processing}>
              {t('users.action.actions.add')}
            </Button>
          </footer>
        </div>
      )}
    </Modal>
  )
}
