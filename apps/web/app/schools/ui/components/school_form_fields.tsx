import { Field, FieldGroup, FieldLabel } from '@workspace/ui/components/field'
import { FieldErrorBag } from '@workspace/ui/components/field-error-bag'
import { Input } from '@workspace/ui/components/input'
import { Textarea } from '@workspace/ui/components/textarea'

import { useTranslation } from '#common/ui/hooks/use_translation'

export interface SchoolFormData {
  name: string
  description: string
}

interface SchoolFormFieldsProps {
  data: SchoolFormData
  errors: Partial<Record<keyof SchoolFormData, string>>
  setData: (key: keyof SchoolFormData, value: string) => void
}

export default function SchoolFormFields({ data, errors, setData }: SchoolFormFieldsProps) {
  const { t } = useTranslation()

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="school-name">{t('schools.action.name')}</FieldLabel>
        <Input
          id="school-name"
          value={data.name}
          onChange={(event) => setData('name', event.target.value)}
        />
        <FieldErrorBag errors={errors} field="name" />
      </Field>

      <Field>
        <FieldLabel htmlFor="school-description">{t('schools.action.description')}</FieldLabel>
        <Textarea
          id="school-description"
          rows={4}
          value={data.description}
          onChange={(event) => setData('description', event.target.value)}
        />
        <FieldErrorBag errors={errors} field="description" />
      </Field>
    </FieldGroup>
  )
}
