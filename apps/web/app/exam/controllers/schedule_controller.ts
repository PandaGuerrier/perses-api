import type { HttpContext } from '@adonisjs/core/http'

import ExamPolicy from '#exam/policies/exam_policy'
import ListUserSchedule from '#exam/queries/list_user_schedule'
import ExamTransformer from '#exam/transformers/exam_transformer'

export default class ScheduleController {
  public async show({ auth, bouncer, inertia }: HttpContext) {
    await bouncer.with(ExamPolicy).authorize('viewSchedule')

    const exams = await new ListUserSchedule().handle({ userUuid: auth.getUserOrFail().uuid })

    return inertia.render('exam/schedule', {
      exams: ExamTransformer.transform(exams).useVariant('forSchedule'),
    })
  }
}
