import type { HttpContext } from '@adonisjs/core/http'

import CreateUser from '#users/actions/create_user'
import DeleteUser from '#users/actions/delete_user'
import { grantableRoles } from '#users/actions/sync_user_roles'
import UpdateUser from '#users/actions/update_user'
import { PERMISSIONS } from '#users/enums/permission'
import User from '#users/models/user'
import UserPolicy from '#users/policies/user_policy'
import ListUsers from '#users/queries/list_users'
import RoleTransformer from '#users/transformers/role_transformer'
import UserTransformer from '#users/transformers/user_transformer'
import { createUserValidator, editUserValidator, listUserValidator } from '#users/validators/users'

export default class UsersController {
  public async index({ auth, bouncer, inertia, request }: HttpContext) {
    await bouncer.with(UserPolicy).authorize('viewList')

    const viewer = auth.getUserOrFail()
    const payload = await request.validateUsing(listUserValidator)

    // A school admin never leaves their own organisation; the super-admin does.
    const platformWide = await viewer.hasPermission(PERMISSIONS.usersViewAny)

    const users = await new ListUsers().handle(
      {
        q: payload.q,
        roles: payload.roles,
        schoolUuid: platformWide ? null : viewer.schoolUuid,
        sort: payload.sort,
        order: payload.order,
      },
      { page: payload.page ?? 1, perPage: payload.perPage ?? 10 }
    )

    return inertia.render('users/index', {
      users: UserTransformer.paginate(users.all(), users.getMeta()).useVariant('forList'),
      roles: RoleTransformer.transform(await grantableRoles(viewer)).useVariant('forList'),
      q: payload.q,
      selectedRoles: payload.roles ?? [],
      sort: payload.sort ?? null,
      order: payload.order ?? null,
    })
  }

  public async create({ auth, bouncer, inertia }: HttpContext) {
    await bouncer.with(UserPolicy).authorize('create')

    return inertia.modal(
      'users/create',
      {
        roles: RoleTransformer.transform(await grantableRoles(auth.getUserOrFail())).useVariant(
          'forList'
        ),
      },
      { route: 'users.index' }
    )
  }

  public async store({ auth, bouncer, request, response }: HttpContext) {
    await bouncer.with(UserPolicy).authorize('create')

    const payload = await request.validateUsing(createUserValidator)
    const executor = auth.getUserOrFail()

    await new CreateUser().handle({
      fullName: payload.fullName,
      email: payload.email,
      roleUuids: payload.roles,
      schoolUuid: payload.schoolId ?? executor.schoolUuid,
      executor,
    })

    return response.redirect().toRoute('users.index')
  }

  public async edit({ auth, bouncer, inertia, params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.load('roles')

    await bouncer.with(UserPolicy).authorize('update', user)

    return inertia.modal(
      'users/edit',
      {
        user: UserTransformer.transform(user).useVariant('forEdit'),
        roles: RoleTransformer.transform(await grantableRoles(auth.getUserOrFail())).useVariant(
          'forList'
        ),
      },
      { route: 'users.index' }
    )
  }

  public async update({ auth, bouncer, params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)

    await bouncer.with(UserPolicy).authorize('update', user)

    const payload = await request.validateUsing(editUserValidator, { meta: { userId: params.id } })

    await new UpdateUser().handle({
      target: user,
      fullName: payload.fullName,
      email: payload.email,
      roleUuids: payload.roles,
      schoolUuid: payload.schoolId ?? user.schoolUuid,
      executor: auth.getUserOrFail(),
    })

    return response.redirect().toRoute('users.index')
  }

  public async destroy({ bouncer, params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)

    await bouncer.with(UserPolicy).authorize('delete', user)

    await new DeleteUser().handle({ target: user })

    return response.redirect().toRoute('users.index')
  }
}
