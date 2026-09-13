import type { HttpContext } from '@adonisjs/core/http'

import CreateExam from '#exam/actions/create_exam'
import DeleteExam from '#exam/actions/delete_exam'
import UpdateExam from '#exam/actions/update_exam'
import Exam from '#exam/models/exam'
import ExamPolicy from '#exam/policies/exam_policy'
import ListExams from '#exam/queries/list_exams'
import ExamTransformer from '#exam/transformers/exam_transformer'
import { createExamValidator, editExamValidator, listExamValidator } from '#exam/validators/exams'
import GroupTransformer from '#schools/transformers/group_transformer'
import Group from '#schools/models/group'
import { ROLES } from '#users/enums/role'
import User from '#users/models/user'
import UserTransformer from '#users/transformers/user_transformer'

export default class ExamsController {
  public async index({ auth, bouncer, inertia, request }: HttpContext) {
    await bouncer.with(ExamPolicy).authorize('viewList')

    const payload = await request.validateUsing(listExamValidator)

    const exams = await new ListExams().handle(
      auth.getUserOrFail(),
      { q: payload.q },
      { page: payload.page ?? 1, perPage: payload.perPage ?? 10 }
    )

    return inertia.render('exam/index', {
      exams: ExamTransformer.paginate(exams.all(), exams.getMeta()).useVariant('forList'),
      q: payload.q,
    })
  }

  public async create({ auth, bouncer, inertia }: HttpContext) {
    await bouncer.with(ExamPolicy).authorize('create')

    return inertia.modal('exam/create', await this.formOptions(auth.getUserOrFail()), {
      route: 'exams.index',
    })
  }

  public async store({ auth, bouncer, request, response }: HttpContext) {
    await bouncer.with(ExamPolicy).authorize('create')

    const payload = await request.validateUsing(createExamValidator)
    const executor = auth.getUserOrFail()

    await new CreateExam().handle({
      schoolUuid: executor.schoolUuid!,
      title: payload.title,
      description: payload.description ?? null,
      startsAt: payload.startsAt,
      endsAt: payload.endsAt,
      studentUuids: payload.students,
      executor,
    })

    return response.redirect().toRoute('exams.index')
  }

  public async edit({ auth, bouncer, inertia, params }: HttpContext) {
    const exam = await Exam.findOrFail(params.id)

    await bouncer.with(ExamPolicy).authorize('update', exam)

    await exam.load('students')

    return inertia.modal(
      'exam/edit',
      {
        exam: ExamTransformer.transform(exam).useVariant('forEdit'),
        ...(await this.formOptions(auth.getUserOrFail())),
      },
      { route: 'exams.index' }
    )
  }

  public async update({ bouncer, params, request, response }: HttpContext) {
    const exam = await Exam.findOrFail(params.id)

    await bouncer.with(ExamPolicy).authorize('update', exam)

    const payload = await request.validateUsing(editExamValidator)

    await new UpdateExam().handle({
      target: exam,
      title: payload.title,
      description: payload.description ?? null,
      startsAt: payload.startsAt,
      endsAt: payload.endsAt,
      studentUuids: payload.students,
    })

    return response.redirect().toRoute('exams.index')
  }

  public async destroy({ bouncer, params, response }: HttpContext) {
    const exam = await Exam.findOrFail(params.id)

    await bouncer.with(ExamPolicy).authorize('delete', exam)

    await new DeleteExam().handle({ target: exam })

    return response.redirect().toRoute('exams.index')
  }

  /**
   * Groups are only a convenience for filling the student list — the exam is
   * stored against the students themselves.
   */
  private async formOptions(executor: User) {
    const schoolUuid = executor.schoolUuid ?? ''

    const [students, groups] = await Promise.all([
      User.query()
        .where('school_uuid', schoolUuid)
        .whereHas('roles', (roles) => roles.where('name', ROLES.STUDENT))
        .orderBy('full_name', 'asc'),
      Group.query().where('school_uuid', schoolUuid).preload('students').orderBy('name', 'asc'),
    ])

    return {
      students: UserTransformer.transform(students).useVariant('forList'),
      groups: groups.map((group) => ({
        ...GroupTransformer.transform(group).useVariant('forEdit'),
        studentIds: group.students.map((student) => student.uuid),
      })),
    }
  }
}
