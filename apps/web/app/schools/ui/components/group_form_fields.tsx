import { Field, FieldGroup, FieldLabel } from '@workspace/ui/components/field'
import { FieldErrorBag } from '@workspace/ui/components/field-error-bag'
import { Input } from '@workspace/ui/components/input'

import { useTranslation } from '#common/ui/hooks/use_translation'

export interface GroupFormData {
  name: string
}

interface GroupFormFieldsProps {
  data: GroupFormData
  errors: Partial<Record<keyof GroupFormData, string>>
  setData: (key: keyof GroupFormData, value: string) => void
}

export default function GroupFormFields({ data, errors, setData }: GroupFormFieldsProps) {
  const { t } = useTranslation()

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="group-name">{t('schools.action.name')}</FieldLabel>
        <Input
          id="group-name"
          value={data.name}
          onChange={(event) => setData('name', event.target.value)}
        />
        <FieldErrorBag errors={errors} field="name" />
      </Field>
    </FieldGroup>
  )
}
