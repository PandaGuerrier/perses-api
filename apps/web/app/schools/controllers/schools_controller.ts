import type { HttpContext } from '@adonisjs/core/http'

import CreateSchool from '#schools/actions/create_school'
import DeleteSchool from '#schools/actions/delete_school'
import UpdateSchool from '#schools/actions/update_school'
import School from '#schools/models/school'
import SchoolPolicy from '#schools/policies/school_policy'
import ListSchools from '#schools/queries/list_schools'
import SchoolTransformer from '#schools/transformers/school_transformer'
import {
  createSchoolValidator,
  editSchoolValidator,
  listSchoolValidator,
} from '#schools/validators/schools'

export default class SchoolsController {
  public async index({ auth, bouncer, inertia, request }: HttpContext) {
    await bouncer.with(SchoolPolicy).authorize('viewList')

    const payload = await request.validateUsing(listSchoolValidator)

    const schools = await new ListSchools().handle(
      auth.getUserOrFail(),
      { q: payload.q },
      { page: payload.page ?? 1, perPage: payload.perPage ?? 10 }
    )

    return inertia.render('schools/index', {
      schools: SchoolTransformer.paginate(schools.all(), schools.getMeta()).useVariant('forList'),
      q: payload.q,
    })
  }

  public async create({ bouncer, inertia }: HttpContext) {
    await bouncer.with(SchoolPolicy).authorize('create')

    return inertia.modal('schools/create', {}, { route: 'schools.index' })
  }

  public async store({ bouncer, request, response }: HttpContext) {
    await bouncer.with(SchoolPolicy).authorize('create')

    const payload = await request.validateUsing(createSchoolValidator)

    await new CreateSchool().handle({
      name: payload.name,
      description: payload.description ?? null,
    })

    return response.redirect().toRoute('schools.index')
  }

  public async edit({ bouncer, inertia, params }: HttpContext) {
    const school = await School.findOrFail(params.id)

    await bouncer.with(SchoolPolicy).authorize('update', school)

    return inertia.modal(
      'schools/edit',
      { school: SchoolTransformer.transform(school).useVariant('forEdit') },
      { route: 'schools.index' }
    )
  }

  public async update({ bouncer, params, request, response }: HttpContext) {
    const school = await School.findOrFail(params.id)

    await bouncer.with(SchoolPolicy).authorize('update', school)

    const payload = await request.validateUsing(editSchoolValidator)

    await new UpdateSchool().handle({
      target: school,
      name: payload.name,
      description: payload.description ?? null,
    })

    return response.redirect().toRoute('schools.index')
  }

  public async destroy({ bouncer, params, response }: HttpContext) {
    const school = await School.findOrFail(params.id)

    await bouncer.with(SchoolPolicy).authorize('delete')

    await new DeleteSchool().handle({ target: school })

    return response.redirect().toRoute('schools.index')
  }
}
