import { useForm } from '@inertiajs/react'
import { Modal } from 'adonis-inertia-modal/react'

import type { InertiaProps } from '#core/ui/types'

import { Button } from '@workspace/ui/components/button'
import { toast } from '@workspace/ui/hooks/use-toast'

import { useTranslation } from '#common/ui/hooks/use_translation'
import ExamFormFields, {
  type ExamFormData,
  type ExamGroupOption,
} from '#exam/ui/components/exam_form_fields'
import { urlFor } from '~/app/client'

import type { Data } from '@generated/data'

type PageProps = InertiaProps<{
  students: Data.Users.User.Variants['forList'][]
  groups: ExamGroupOption[]
}>

export default function CreateExamPage({ students, groups }: PageProps) {
  const { t } = useTranslation()

  const { data, setData, errors, post, processing, reset } = useForm<ExamFormData>({
    title: '',
    description: '',
    startsAt: '',
    endsAt: '',
    students: [],
  })

  return (
    <Modal maxWidth="lg">
      {({ close }) => (
        <div className="space-y-4">
          <header className="space-y-1 text-left">
            <h2 className="text-lg font-semibold">{t('exam.action.create')}</h2>
          </header>

          <form
            id="create-exam-form"
            onSubmit={(event) => {
              event.preventDefault()
              post(urlFor('exams.store'), {
                preserveScroll: true,
                onSuccess: () => {
                  close()
                  toast(t('exam.action.create'), { description: data.title })
                },
                onFinish: () => reset(),
              })
            }}
          >
            <ExamFormFields
              data={data}
              errors={errors}
              setData={(key, value) => setData(key, value as never)}
              students={students}
              groups={groups}
            />
          </form>

          <footer className="flex justify-end gap-2">
            <Button variant="outline" onClick={close}>
              {t('exam.action.cancel')}
            </Button>
            <Button type="submit" form="create-exam-form" disabled={processing}>
              {t('exam.action.save')}
            </Button>
          </footer>
        </div>
      )}
    </Modal>
  )
}
