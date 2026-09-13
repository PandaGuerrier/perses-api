import type { HttpContext } from '@adonisjs/core/http'

import GetPlatformOverview from '#dashboard/queries/get_platform_overview'
import GetSchoolOverview from '#dashboard/queries/get_school_overview'
import GetTeachingOverview from '#dashboard/queries/get_teaching_overview'
import GetUpcomingSchedule from '#dashboard/queries/get_upcoming_schedule'
import { globalPermissions } from '#users/services/global_permissions'

export default class DashboardController {
  /**
   * One page, sections gated by what the user holds — no branch on role name,
   * so a custom role widens the dashboard the same way it widens the nav.
   */
  public async show({ auth, inertia }: HttpContext) {
    const user = auth.getUserOrFail()
    const can = await globalPermissions(user)

    const [platform, school, teaching, schedule] = await Promise.all([
      can.manageSchools ? new GetPlatformOverview().handle() : null,
      user.schoolUuid ? new GetSchoolOverview().handle({ schoolUuid: user.schoolUuid }) : null,
      can.manageGroups && user.schoolUuid
        ? new GetTeachingOverview().handle({ schoolUuid: user.schoolUuid })
        : null,
      can.viewSchedule ? new GetUpcomingSchedule().handle({ userUuid: user.uuid }) : null,
    ])

    return inertia.render('dashboard/index', { platform, school, teaching, schedule })
  }
}
