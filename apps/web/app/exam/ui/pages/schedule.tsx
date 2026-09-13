import { CalendarDays } from 'lucide-react'

import type { InertiaProps } from '#core/ui/types'

import AuthenticatedLayout from '#common/ui/components/authenticated_layout'
import Heading from '#common/ui/components/heading'

import { useTranslation } from '#common/ui/hooks/use_translation'

import { Card, CardContent } from '@workspace/ui/components/card'

import type { Data } from '@generated/data'

type PageProps = InertiaProps<{
  exams: Data.Exam.Exam.Variants['forSchedule'][]
}>

export default function SchedulePage({ exams }: PageProps) {
  const { t } = useTranslation()

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: t('exam.schedule.page.breadcrumbs.schedule') }]}>
      <div className="py-8">
        <Heading
          title={t('exam.schedule.page.title')}
          description={t('exam.schedule.page.description')}
        />

        {exams.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('exam.schedule.empty')}</p>
        ) : (
          <div className="space-y-3">
            {exams.map((exam) => (
              <Card key={exam.id}>
                <CardContent className="flex items-start gap-4 p-5">
                  <CalendarDays className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="font-medium">{exam.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(exam.startsAt).toLocaleString()} →{' '}
                      {new Date(exam.endsAt).toLocaleString()}
                    </p>
                    {exam.description && (
                      <p className="mt-2 text-sm text-muted-foreground">{exam.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
