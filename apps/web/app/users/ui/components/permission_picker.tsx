import { Checkbox } from '@workspace/ui/components/checkbox'
import { ScrollArea } from '@workspace/ui/components/scroll-area'

interface PermissionPickerProps {
  /** Everything the executor may hand out — never the full catalogue. */
  grantable: string[]
  selected: string[]
  onChange: (permissions: string[]) => void
}

/** Groups `<subject>.<action>` by subject so the list stays readable. */
export default function PermissionPicker({
  grantable,
  selected,
  onChange,
}: PermissionPickerProps) {
  const groups = grantable.reduce<Record<string, string[]>>((acc, permission) => {
    const [subject] = permission.split('.')
    acc[subject] = [...(acc[subject] ?? []), permission]
    return acc
  }, {})

  const toggle = (permission: string, checked: boolean) => {
    onChange(
      checked ? [...selected, permission] : selected.filter((value) => value !== permission)
    )
  }

  return (
    <ScrollArea className="h-72 rounded-md border p-3">
      <div className="space-y-4">
        {Object.entries(groups).map(([subject, permissions]) => (
          <div key={subject}>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {subject.replace('_', ' ')}
            </p>
            <div className="space-y-1.5">
              {permissions.map((permission) => (
                <div key={permission} className="flex items-center gap-2">
                  <Checkbox
                    id={`permission-${permission}`}
                    checked={selected.includes(permission)}
                    onCheckedChange={(checked) => toggle(permission, checked === true)}
                  />
                  <label
                    htmlFor={`permission-${permission}`}
                    className="cursor-pointer text-sm text-muted-foreground"
                  >
                    {permission.split('.')[1]?.replace('_', ' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
