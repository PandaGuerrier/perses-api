import { useForm } from '@inertiajs/react'
import { Modal } from 'adonis-inertia-modal/react'

import type { InertiaProps } from '#core/ui/types'

import { Button } from '@workspace/ui/components/button'
import { toast } from '@workspace/ui/hooks/use-toast'

import { useTranslation } from '#common/ui/hooks/use_translation'
import SchoolFormFields, { type SchoolFormData } from '#schools/ui/components/school_form_fields'
import { urlFor } from '~/app/client'

import type { Data } from '@generated/data'

type PageProps = InertiaProps<{
  school: Data.Schools.School.Variants['forEdit']
}>

export default function EditSchoolPage({ school }: PageProps) {
  const { t } = useTranslation()

  const { data, setData, errors, put, processing } = useForm<SchoolFormData>({
    name: school.name,
    description: school.description ?? '',
  })

  return (
    <Modal maxWidth="md">
      {({ close }) => (
        <div className="space-y-4">
          <header className="space-y-1 text-left">
            <h2 className="text-lg font-semibold">{t('schools.action.edit')}</h2>
          </header>

          <form
            id="edit-school-form"
            onSubmit={(event) => {
              event.preventDefault()
              put(urlFor('schools.update', { id: school.id }), {
                preserveScroll: true,
                onSuccess: () => {
                  close()
                  toast(t('schools.action.edit'), { description: data.name })
                },
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
            <Button type="submit" form="edit-school-form" disabled={processing}>
              {t('schools.action.save')}
            </Button>
          </footer>
        </div>
      )}
    </Modal>
  )
}
