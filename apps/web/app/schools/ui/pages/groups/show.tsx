import { useForm } from '@inertiajs/react'
import React from 'react'

import type { InertiaProps } from '#core/ui/types'

import AdminLayout from '#common/ui/components/admin_layout'
import Heading from '#common/ui/components/heading'
import { Main } from '#common/ui/components/main'

import { useTranslation } from '#common/ui/hooks/use_translation'
import { urlFor } from '~/app/client'

import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Checkbox } from '@workspace/ui/components/checkbox'
import { toast } from '@workspace/ui/hooks/use-toast'

import type { Data } from '@generated/data'

type Student = Data.Users.User.Variants['forList']

type PageProps = InertiaProps<{
  group: Data.Schools.Group.Variants['forEdit']
  schoolName: string | null
  students: Student[]
  candidates: Student[]
}>

/**
 * The class list is edited as a whole and submitted in one PUT, so removing and
 * adding students is a single decision rather than a row of ajax calls.
 */
export default function ShowGroupPage({ group, schoolName, students, candidates }: PageProps) {
  const { t } = useTranslation()

  const { data, setData, put, processing } = useForm<{ students: string[] }>({
    students: students.map((student) => student.id),
  })

  const roster = React.useMemo(
    () => [...students, ...candidates].sort((a, b) => (a.fullName ?? '').localeCompare(b.fullName ?? '')),
    [students, candidates]
  )

  const toggle = (id: string, checked: boolean) => {
    setData(
      'students',
      checked ? [...data.students, id] : data.students.filter((value) => value !== id)
    )
  }

  return (
    <AdminLayout
      breadcrumbs={[
        { label: t('schools.groups.page.breadcrumbs.groups'), href: '/groups' },
        { label: group.name },
      ]}
    >
      <Main>
        <Heading title={group.name} description={schoolName ?? undefined}>
          <Button
            disabled={processing}
            onClick={() =>
              put(urlFor('groups.students.sync', { id: group.id }), {
                preserveScroll: true,
                onSuccess: () => toast(t('schools.groups.detail.save')),
              })
            }
          >
            {t('schools.groups.detail.save')}
          </Button>
        </Heading>

        <Card>
          <CardHeader>
            <CardTitle>{t('schools.groups.detail.students')}</CardTitle>
          </CardHeader>
          <CardContent>
            {roster.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('schools.groups.detail.empty')}</p>
            ) : (
              <ul className="divide-y">
                {roster.map((student) => (
                  <li key={student.id} className="flex items-center gap-3 py-2.5">
                    <Checkbox
                      id={`student-${student.id}`}
                      checked={data.students.includes(student.id)}
                      onCheckedChange={(checked) => toggle(student.id, checked === true)}
                    />
                    <label htmlFor={`student-${student.id}`} className="min-w-0 flex-1 cursor-pointer">
                      <span className="block truncate text-sm font-medium">
                        {student.fullName || student.email}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {student.email}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </Main>
    </AdminLayout>
  )
}
