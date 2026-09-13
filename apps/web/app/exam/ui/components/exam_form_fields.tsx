import React from 'react'

import { Button } from '@workspace/ui/components/button'
import { Checkbox } from '@workspace/ui/components/checkbox'
import { Field, FieldGroup, FieldLabel } from '@workspace/ui/components/field'
import { FieldErrorBag } from '@workspace/ui/components/field-error-bag'
import { Input } from '@workspace/ui/components/input'
import { ScrollArea } from '@workspace/ui/components/scroll-area'
import { Textarea } from '@workspace/ui/components/textarea'

import { useTranslation } from '#common/ui/hooks/use_translation'

import type { Data } from '@generated/data'

export interface ExamFormData {
  title: string
  description: string
  startsAt: string
  endsAt: string
  students: string[]
}

export type ExamGroupOption = Data.Schools.Group.Variants['forEdit'] & { studentIds: string[] }

interface ExamFormFieldsProps {
  data: ExamFormData
  errors: Partial<Record<keyof ExamFormData, string>>
  setData: <K extends keyof ExamFormData>(key: K, value: ExamFormData[K]) => void
  students: Data.Users.User.Variants['forList'][]
  groups: ExamGroupOption[]
}

export default function ExamFormFields({
  data,
  errors,
  setData,
  students,
  groups,
}: ExamFormFieldsProps) {
  const { t } = useTranslation()

  const toggle = React.useCallback(
    (id: string, checked: boolean) => {
      setData(
        'students',
        checked ? [...data.students, id] : data.students.filter((value) => value !== id)
      )
    },
    [data.students, setData]
  )

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="exam-title">{t('exam.action.title')}</FieldLabel>
        <Input
          id="exam-title"
          value={data.title}
          onChange={(event) => setData('title', event.target.value)}
        />
        <FieldErrorBag errors={errors} field="title" />
      </Field>

      <Field>
        <FieldLabel htmlFor="exam-description">{t('exam.action.description')}</FieldLabel>
        <Textarea
          id="exam-description"
          rows={3}
          value={data.description}
          onChange={(event) => setData('description', event.target.value)}
        />
        <FieldErrorBag errors={errors} field="description" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="exam-starts-at">{t('exam.action.starts_at')}</FieldLabel>
          <Input
            id="exam-starts-at"
            type="datetime-local"
            value={data.startsAt}
            onChange={(event) => setData('startsAt', event.target.value)}
          />
          <FieldErrorBag errors={errors} field="startsAt" />
        </Field>

        <Field>
          <FieldLabel htmlFor="exam-ends-at">{t('exam.action.ends_at')}</FieldLabel>
          <Input
            id="exam-ends-at"
            type="datetime-local"
            value={data.endsAt}
            onChange={(event) => setData('endsAt', event.target.value)}
          />
          <FieldErrorBag errors={errors} field="endsAt" />
        </Field>
      </div>

      <Field>
        <FieldLabel>{t('exam.action.students')}</FieldLabel>

        {groups.length > 0 && (
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {t('exam.action.fill_from_group')}
            </span>
            {groups.map((group) => (
              <Button
                key={group.id}
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  setData('students', [...new Set([...data.students, ...group.studentIds])])
                }
              >
                {group.name}
              </Button>
            ))}
          </div>
        )}

        <ScrollArea className="h-56 rounded-md border">
          <ul className="divide-y">
            {students.map((student) => (
              <li key={student.id} className="flex items-center gap-3 px-3 py-2">
                <Checkbox
                  id={`exam-student-${student.id}`}
                  checked={data.students.includes(student.id)}
                  onCheckedChange={(checked) => toggle(student.id, checked === true)}
                />
                <label
                  htmlFor={`exam-student-${student.id}`}
                  className="min-w-0 flex-1 cursor-pointer truncate text-sm"
                >
                  {student.fullName || student.email}
                </label>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <FieldErrorBag errors={errors} field="students" />
      </Field>
    </FieldGroup>
  )
}
