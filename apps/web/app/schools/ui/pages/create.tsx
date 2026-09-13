import { useForm } from '@inertiajs/react'
import { Modal } from 'adonis-inertia-modal/react'

import { Button } from '@workspace/ui/components/button'
import { toast } from '@workspace/ui/hooks/use-toast'

import { useTranslation } from '#common/ui/hooks/use_translation'
import SchoolFormFields, { type SchoolFormData } from '#schools/ui/components/school_form_fields'
import { urlFor } from '~/app/client'

export default function CreateSchoolPage() {
  const { t } = useTranslation()

  const { data, setData, errors, post, processing, reset } = useForm<SchoolFormData>({
    name: '',
    description: '',
  })

  return (
    <Modal maxWidth="md">
      {({ close }) => (
        <div className="space-y-4">
          <header className="space-y-1 text-left">
            <h2 className="text-lg font-semibold">{t('schools.action.create')}</h2>
          </header>

          <form
            id="create-school-form"
            onSubmit={(event) => {
              event.preventDefault()
              post(urlFor('schools.store'), {
                preserveScroll: true,
                onSuccess: () => {
                  close()
                  toast(t('schools.action.create'), { description: data.name })
                },
                onFinish: () => reset(),
              })
            }}
          >
            <SchoolFormFields
              data={data}
              errors={errors}
              setData={(key, value) => setData(key, value)}
            />
          </form>

          <footer className="flex justify-end gap-2">
            <Button variant="outline" onClick={close}>
              {t('schools.action.cancel')}
            </Button>
            <Button type="submit" form="create-school-form" disabled={processing}>
              {t('schools.action.save')}
            </Button>
          </footer>
        </div>
      )}
    </Modal>
  )
}
