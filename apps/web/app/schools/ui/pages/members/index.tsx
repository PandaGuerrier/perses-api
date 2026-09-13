import { router, useForm } from '@inertiajs/react'
import { Trash2, UserMinus } from 'lucide-react'

import type { InertiaProps } from '#core/ui/types'

import AdminLayout from '#common/ui/components/admin_layout'
import Heading from '#common/ui/components/heading'
import { Main } from '#common/ui/components/main'
import PaginatedTable, { type Paginated } from '#common/ui/components/paginated_table'

import useCan from '#common/ui/hooks/use_can'
import { useTranslation } from '#common/ui/hooks/use_translation'
import { urlFor } from '~/app/client'

import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import type { ColumnDef } from '@workspace/ui/components/data-table'
import { Field, FieldLabel } from '@workspace/ui/components/field'
import { FieldErrorBag } from '@workspace/ui/components/field-error-bag'
import { Input } from '@workspace/ui/components/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { toast } from '@workspace/ui/hooks/use-toast'

import type { Data } from '@generated/data'

type Member = Data.Users.User.Variants['forList']
type Invitation = Data.Schools.SchoolInvitation.Variants['forList']

type PageProps = InertiaProps<{
  school: Data.Schools.School.Variants['forEdit']
  members: Paginated<Member>
  invitations: Invitation[]
  roles: Data.Users.Role.Variants['forList'][]
  q?: string
  selectedRoles: string[]
  sort: string | null
  order: string | null
}>

const NO_ROLE = 'none'

export default function SchoolMembersPage({ school, members, invitations, roles, q }: PageProps) {
  const { t } = useTranslation()
  const can = useCan()

  const columns: ColumnDef<Member>[] = [
    {
      id: 'fullName',
      header: t('schools.members.table.name'),
      accessorKey: 'fullName',
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="truncate font-medium">
            {row.original.fullName || row.original.email}
          </div>
          <div className="truncate text-xs text-muted-foreground sm:hidden">
            {row.original.email}
          </div>
        </div>
      ),
    },
    {
      id: 'email',
      header: t('schools.members.table.email'),
      accessorKey: 'email',
      meta: { columnClasses: 'hidden sm:table-cell' },
    },
    {
      id: 'roles',
      header: t('schools.members.table.roles'),
      meta: { columnClasses: 'hidden md:table-cell' },
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.roles.map((role) => (
            <Badge key={role} variant="secondary" className="capitalize">
              {role.replace('_', ' ')}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: 'actions',
      meta: { columnClasses: 'w-[52px]' },
      cell: ({ row }) =>
        can.manageMembers ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            title={t('schools.action.remove_member')}
            onClick={() =>
              router.delete(
                urlFor('schools.members.destroy', { school_id: school.id, id: row.original.id }),
                { preserveScroll: true }
              )
            }
          >
            <UserMinus className="size-4" />
          </Button>
        ) : null,
    },
  ]

  return (
    <AdminLayout
      breadcrumbs={[
        { label: t('schools.index.page.breadcrumbs.schools'), href: '/schools' },
        { label: school.name },
      ]}
    >
      <Main>
        <Heading
          title={t('schools.members.page.title')}
          description={t('schools.members.page.description')}
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <PaginatedTable
            url={urlFor('schools.members.index', { school_id: school.id })}
            rows={members}
            columns={columns}
            q={q}
            searchPlaceholder={t('schools.members.table.email')}
          />

          <div className="space-y-6">
            <InviteCard schoolId={school.id} roles={roles} />
            <InvitationsCard schoolId={school.id} invitations={invitations} />
          </div>
        </div>
      </Main>
    </AdminLayout>
  )
}

function InviteCard({
  schoolId,
  roles,
}: {
  schoolId: string
  roles: Data.Users.Role.Variants['forList'][]
}) {
  const { t } = useTranslation()

  const { data, setData, errors, post, processing, reset, transform } = useForm<{
    email: string
    roleId: string
  }>({ email: '', roleId: NO_ROLE })

  // The select needs a non-empty sentinel; the API wants an absent role.
  transform((payload) => ({
    ...payload,
    roleId: payload.roleId === NO_ROLE ? null : payload.roleId,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('schools.members.invite.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            post(urlFor('schools.members.store', { school_id: schoolId }), {
              preserveScroll: true,
              onSuccess: () => {
                toast(t('schools.members.invite.submit'), { description: data.email })
                reset()
              },
            })
          }}
        >
          <Field>
            <FieldLabel htmlFor="invite-email">{t('schools.members.invite.email')}</FieldLabel>
            <Input
              id="invite-email"
              type="email"
              value={data.email}
              onChange={(event) => setData('email', event.target.value)}
            />
            <FieldErrorBag errors={errors} field="email" />
          </Field>

          <Field>
            <FieldLabel htmlFor="invite-role">{t('schools.members.invite.role')}</FieldLabel>
            <Select value={data.roleId} onValueChange={(value) => setData('roleId', value)}>
              <SelectTrigger id="invite-role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_ROLE}>{t('schools.members.invite.no_role')}</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id} className="capitalize">
                    {role.name.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldErrorBag errors={errors} field="roleId" />
          </Field>

          <Button type="submit" className="w-full" disabled={processing}>
            {t('schools.members.invite.submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function InvitationsCard({
  schoolId,
  invitations,
}: {
  schoolId: string
  invitations: Invitation[]
}) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('schools.members.invitations.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-xs text-muted-foreground">
          {t('schools.members.invitations.description')}
        </p>
        {invitations.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t('schools.members.invitations.empty')}
          </p>
        ) : (
          <ul className="divide-y">
            {invitations.map((invitation) => (
              <li key={invitation.id} className="flex items-center gap-2 py-2">
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-sm">{invitation.email}</span>
                  {invitation.roleName && (
                    <span className="block truncate text-xs capitalize text-muted-foreground">
                      {invitation.roleName.replace('_', ' ')}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  title={t('schools.members.invitations.revoke')}
                  onClick={() =>
                    router.delete(
                      urlFor('schools.invitations.destroy', {
                        school_id: schoolId,
                        id: invitation.id,
                      }),
                      { preserveScroll: true }
                    )
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
