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
  exam: Data.Exam.Exam.Variants['forEdit']
  students: Data.Users.User.Variants['forList'][]
  groups: ExamGroupOption[]
}>

/** `datetime-local` wants `YYYY-MM-DDTHH:mm` in local time, not an ISO string. */
function toLocalInput(iso: string): string {
  const date = new Date(iso)
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

export default function EditExamPage({ exam, students, groups }: PageProps) {
  const { t } = useTranslation()

  const { data, setData, errors, put, processing } = useForm<ExamFormData>({
    title: exam.title,
    description: exam.description ?? '',
    startsAt: toLocalInput(exam.startsAt),
    endsAt: toLocalInput(exam.endsAt),
    students: exam.students,
  })

  return (
    <Modal maxWidth="lg">
      {({ close }) => (
        <div className="space-y-4">
          <header className="space-y-1 text-left">
            <h2 className="text-lg font-semibold">{t('exam.action.edit')}</h2>
          </header>

          <form
            id="edit-exam-form"
            onSubmit={(event) => {
              event.preventDefault()
              put(urlFor('exams.update', { id: exam.id }), {
                preserveScroll: true,
                onSuccess: () => {
                  close()
                  toast(t('exam.action.edit'), { description: data.title })
                },
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
            <Button type="submit" form="edit-exam-form" disabled={processing}>
              {t('exam.action.save')}
            </Button>
          </footer>
        </div>
      )}
    </Modal>
  )
}
