import { Checkbox } from '@workspace/ui/components/checkbox'
import { Field, FieldGroup, FieldLabel } from '@workspace/ui/components/field'
import { FieldErrorBag } from '@workspace/ui/components/field-error-bag'
import { Input } from '@workspace/ui/components/input'

import { useTranslation } from '#common/ui/hooks/use_translation'

import type { Data } from '@generated/data'

export type UserFormData = {
  fullName: string
  email: string
  roles: string[]
}

interface Props {
  data: UserFormData
  errors: Partial<Record<keyof UserFormData, string>>
  setData: <K extends keyof UserFormData>(key: K, value: UserFormData[K]) => void
  roles: Data.Users.Role.Variants['forList'][]
}

/** Shared form fields for create and edit modals. */
export default function UserFormFields({ data, errors, setData, roles }: Props) {
  const { t } = useTranslation()

  const toggle = (id: string, checked: boolean) => {
    setData('roles', checked ? [...data.roles, id] : data.roles.filter((value) => value !== id))
  }

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="fullName">{t('users.action.form.full_name.label')}</FieldLabel>
        <Input
          id="fullName"
          value={data.fullName}
          onChange={(event) => setData('fullName', event.target.value)}
        />
        <FieldErrorBag errors={errors} field="fullName" />
      </Field>

      <Field>
        <FieldLabel htmlFor="email">{t('users.action.form.email.label')}</FieldLabel>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(event) => setData('email', event.target.value)}
        />
        <FieldErrorBag errors={errors} field="email" />
      </Field>

      <Field>
        <FieldLabel>{t('users.action.form.role.label')}</FieldLabel>
        <div className="space-y-1.5 rounded-md border p-3">
          {roles.map((role) => (
            <div key={role.id} className="flex items-center gap-2">
              <Checkbox
                id={`role-${role.id}`}
                checked={data.roles.includes(role.id)}
                onCheckedChange={(checked) => toggle(role.id, checked === true)}
              />
              <label
                htmlFor={`role-${role.id}`}
                className="cursor-pointer text-sm capitalize"
              >
                {role.name.replace('_', ' ')}
              </label>
            </div>
          ))}
        </div>
        <FieldErrorBag errors={errors} field="roles" />
      </Field>
    </FieldGroup>
  )
}
