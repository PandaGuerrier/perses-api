import { useForm } from '@inertiajs/react'
import { Modal } from 'adonis-inertia-modal/react'

import type { InertiaProps } from '#core/ui/types'

import { Button } from '@workspace/ui/components/button'
import { toast } from '@workspace/ui/hooks/use-toast'

import { useTranslation } from '#common/ui/hooks/use_translation'
import GroupFormFields, { type GroupFormData } from '#schools/ui/components/group_form_fields'
import { urlFor } from '~/app/client'

import type { Data } from '@generated/data'

type PageProps = InertiaProps<{
  group: Data.Schools.Group.Variants['forEdit']
}>

export default function EditGroupPage({ group }: PageProps) {
  const { t } = useTranslation()

  const { data, setData, errors, put, processing } = useForm<GroupFormData>({ name: group.name })

  return (
    <Modal maxWidth="sm">
      {({ close }) => (
        <div className="space-y-4">
          <header className="space-y-1 text-left">
            <h2 className="text-lg font-semibold">{t('schools.action.edit_group')}</h2>
          </header>

          <form
            id="edit-group-form"
            onSubmit={(event) => {
              event.preventDefault()
              put(urlFor('groups.update', { id: group.id }), {
                preserveScroll: true,
                onSuccess: () => {
                  close()
                  toast(t('schools.action.edit_group'), { description: data.name })
                },
              })
            }}
          >
            <GroupFormFields
              data={data}
              errors={errors}
              setData={(key, value) => setData(key, value)}
            />
          </form>

          <footer className="flex justify-end gap-2">
            <Button variant="outline" onClick={close}>
              {t('schools.action.cancel')}
            </Button>
            <Button type="submit" form="edit-group-form" disabled={processing}>
              {t('schools.action.save')}
            </Button>
          </footer>
        </div>
      )}
    </Modal>
  )
}
