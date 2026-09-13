import type { HttpContext } from '@adonisjs/core/http'

import CreateGroup from '#schools/actions/create_group'
import DeleteGroup from '#schools/actions/delete_group'
import SyncGroupStudents from '#schools/actions/sync_group_students'
import UpdateGroup from '#schools/actions/update_group'
import Group from '#schools/models/group'
import GroupPolicy from '#schools/policies/group_policy'
import ListGroupCandidates from '#schools/queries/list_group_candidates'
import ListGroups from '#schools/queries/list_groups'
import GroupTransformer from '#schools/transformers/group_transformer'
import {
  createGroupValidator,
  editGroupValidator,
  listGroupValidator,
  syncGroupStudentsValidator,
} from '#schools/validators/groups'
import UserTransformer from '#users/transformers/user_transformer'

export default class GroupsController {
  public async index({ auth, bouncer, inertia, request }: HttpContext) {
    await bouncer.with(GroupPolicy).authorize('viewList')

    const payload = await request.validateUsing(listGroupValidator)

    const groups = await new ListGroups().handle(
      auth.getUserOrFail(),
      { q: payload.q },
      { page: payload.page ?? 1, perPage: payload.perPage ?? 10 }
    )

    return inertia.render('schools/groups/index', {
      groups: GroupTransformer.paginate(groups.all(), groups.getMeta()).useVariant('forList'),
      q: payload.q,
    })
  }

  public async show({ bouncer, inertia, params }: HttpContext) {
    const group = await Group.findOrFail(params.id)

    await bouncer.with(GroupPolicy).authorize('view', group)

    await group.load('school')
    const students = await group.related('students').query().preload('roles').orderBy('full_name')
    const candidates = await new ListGroupCandidates().handle({
      schoolUuid: group.schoolUuid,
      groupUuid: group.uuid,
    })

    return inertia.render('schools/groups/show', {
      group: GroupTransformer.transform(group).useVariant('forEdit'),
      schoolName: group.school?.name ?? null,
      students: UserTransformer.transform(students).useVariant('forList'),
      candidates: UserTransformer.transform(candidates).useVariant('forList'),
    })
  }

  public async create({ bouncer, inertia }: HttpContext) {
    await bouncer.with(GroupPolicy).authorize('create')

    return inertia.modal('schools/groups/create', {}, { route: 'groups.index' })
  }

  public async store({ auth, bouncer, request, response }: HttpContext) {
    await bouncer.with(GroupPolicy).authorize('create')

    const payload = await request.validateUsing(createGroupValidator)

    await new CreateGroup().handle({
      schoolUuid: auth.getUserOrFail().schoolUuid!,
      name: payload.name,
    })

    return response.redirect().toRoute('groups.index')
  }

  public async edit({ bouncer, inertia, params }: HttpContext) {
    const group = await Group.findOrFail(params.id)

    await bouncer.with(GroupPolicy).authorize('update', group)

    return inertia.modal(
      'schools/groups/edit',
      { group: GroupTransformer.transform(group).useVariant('forEdit') },
      { route: 'groups.index' }
    )
  }

  public async update({ bouncer, params, request, response }: HttpContext) {
    const group = await Group.findOrFail(params.id)

    await bouncer.with(GroupPolicy).authorize('update', group)

    const payload = await request.validateUsing(editGroupValidator)

    await new UpdateGroup().handle({ target: group, name: payload.name })

    return response.redirect().toRoute('groups.index')
  }

  public async destroy({ bouncer, params, response }: HttpContext) {
    const group = await Group.findOrFail(params.id)

    await bouncer.with(GroupPolicy).authorize('delete', group)

    await new DeleteGroup().handle({ target: group })

    return response.redirect().toRoute('groups.index')
  }

  public async syncStudents({ bouncer, params, request, response }: HttpContext) {
    const group = await Group.findOrFail(params.id)

    await bouncer.with(GroupPolicy).authorize('manageMembers', group)

    const payload = await request.validateUsing(syncGroupStudentsValidator)

    await new SyncGroupStudents().handle({ group, studentUuids: payload.students })

    return response.redirect().back()
  }
}
