import { Link } from '@inertiajs/react'
import {
  Building2,
  CalendarDays,
  GraduationCap,
  Mail,
  UserRound,
  Users,
  UsersRound,
} from 'lucide-react'

import type { InertiaProps } from '#core/ui/types'

import AdminLayout from '#common/ui/components/admin_layout'
import Heading from '#common/ui/components/heading'
import { Main } from '#common/ui/components/main'
import StatCard from '#common/ui/components/stat_card'

import { useTranslation } from '#common/ui/hooks/use_translation'

import type { PlatformOverview } from '#dashboard/queries/get_platform_overview'
import type { SchoolOverview } from '#dashboard/queries/get_school_overview'
import type { TeachingOverview } from '#dashboard/queries/get_teaching_overview'
import type { UpcomingSchedule } from '#dashboard/queries/get_upcoming_schedule'

import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'

type PageProps = InertiaProps<{
  platform: PlatformOverview | null
  school: SchoolOverview | null
  teaching: TeachingOverview | null
  schedule: UpcomingSchedule | null
}>

/**
 * Sections appear from what the viewer holds, not from their role name — a
 * custom role that grants `exams.view_list` widens this page the same way it
 * widens the sidebar.
 */
export default function DashboardPage({ platform, school, teaching, schedule }: PageProps) {
  const { t } = useTranslation()

  const isEmpty = !platform && !school && !teaching && !schedule

  return (
    <AdminLayout breadcrumbs={[{ label: t('dashboard.page.breadcrumbs.dashboard') }]}>
      <Main>
        <Heading
          title={t('dashboard.page.title')}
          description={t('dashboard.page.description')}
        />

        {isEmpty && (
          <Card>
            <CardContent className="p-6">
              <p className="font-medium">{t('dashboard.empty.title')}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('dashboard.empty.description')}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-8">
          {platform && (
            <section className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                {t('dashboard.platform.title')}
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                  label={t('dashboard.platform.schools')}
                  value={platform.schools}
                  icon={Building2}
                />
                <StatCard
                  label={t('dashboard.platform.users')}
                  value={platform.users}
                  icon={Users}
                />
                <StatCard
                  label={t('dashboard.platform.pending_invitations')}
                  value={platform.pendingInvitations}
                  icon={Mail}
                />
              </div>

              {platform.latestSchools.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('dashboard.platform.latest')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="divide-y">
                      {platform.latestSchools.map((item) => (
                        <li key={item.id} className="flex items-center justify-between py-2.5">
                          <span className="truncate font-medium">{item.name}</span>
                          <span className="shrink-0 text-sm text-muted-foreground">
                            {item.membersCount} · {item.groupsCount}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </section>
          )}

          {school && (
            <section className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                {t('dashboard.school.title')} — {school.name}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  label={t('dashboard.school.students')}
                  value={school.students}
                  icon={UserRound}
                />
                <StatCard
                  label={t('dashboard.school.teachers')}
                  value={school.teachers}
                  icon={Users}
                />
                <StatCard
                  label={t('dashboard.school.groups')}
                  value={school.groups}
                  icon={UsersRound}
                />
                <StatCard
                  label={t('dashboard.school.upcoming_exams')}
                  value={school.upcomingExams}
                  icon={GraduationCap}
                />
              </div>
            </section>
          )}

          {teaching && (
            <section className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.teaching.groups')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {teaching.groups.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {t('dashboard.teaching.empty_groups')}
                    </p>
                  ) : (
                    <ul className="divide-y">
                      {teaching.groups.map((group) => (
                        <li key={group.id} className="flex items-center justify-between py-2.5">
                          <Link href={`/groups/${group.id}`} className="truncate hover:underline">
                            {group.name}
                          </Link>
                          <span className="shrink-0 text-sm text-muted-foreground">
                            {group.studentsCount}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.teaching.upcoming_exams')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {teaching.upcomingExams.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {t('dashboard.teaching.empty_exams')}
                    </p>
                  ) : (
                    <ul className="divide-y">
                      {teaching.upcomingExams.map((exam) => (
                        <li key={exam.id} className="py-2.5">
                          <p className="truncate font-medium">{exam.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(exam.startsAt).toLocaleString()} · {exam.studentsCount}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </section>
          )}

          {schedule && (
            <section>
              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.schedule.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {schedule.exams.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {t('dashboard.schedule.empty')}
                    </p>
                  ) : (
                    <>
                      <ul className="divide-y">
                        {schedule.exams.map((exam) => (
                          <li key={exam.id} className="flex items-start gap-3 py-2.5">
                            <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                            <div className="min-w-0">
                              <p className="truncate font-medium">{exam.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(exam.startsAt).toLocaleString()}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/schedule"
                        className="mt-3 inline-block text-sm text-muted-foreground hover:underline"
                      >
                        {t('dashboard.schedule.see_all')}
                      </Link>
                    </>
                  )}
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      </Main>
    </AdminLayout>
  )
}
