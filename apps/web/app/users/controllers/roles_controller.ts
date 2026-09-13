import type { HttpContext } from '@adonisjs/core/http'

import CreateRole from '#users/actions/create_role'
import DeleteRole from '#users/actions/delete_role'
import UpdateRole from '#users/actions/update_role'
import type { Permission } from '#users/enums/permission'
import { ALL_PERMISSIONS } from '#users/enums/permission'
import Role from '#users/models/role'
import RolePolicy from '#users/policies/role_policy'
import ListRoles from '#users/queries/list_roles'
import RoleTransformer from '#users/transformers/role_transformer'
import { createRoleValidator, updateRoleValidator } from '#users/validators/roles'

export default class RolesController {
  public async index({ auth, bouncer, inertia }: HttpContext) {
    await bouncer.with(RolePolicy).authorize('viewList')

    const viewer = auth.getUserOrFail()
    const roles = await new ListRoles().handle({ viewer })

    return inertia.render('users/roles/index', {
      roles: RoleTransformer.transform(roles).useVariant('forList'),
      // An admin may only hand out what they hold themselves.
      grantablePermissions: await viewer.getPermissions(),
      allPermissions: ALL_PERMISSIONS as unknown as string[],
    })
  }

  public async create({ auth, bouncer, inertia }: HttpContext) {
    await bouncer.with(RolePolicy).authorize('create')

    return inertia.modal(
      'users/roles/create',
      { grantablePermissions: await auth.getUserOrFail().getPermissions() },
      { route: 'roles.index' }
    )
  }

  public async store({ auth, bouncer, request, response }: HttpContext) {
    await bouncer.with(RolePolicy).authorize('create')

    const payload = await request.validateUsing(createRoleValidator)

    await new CreateRole().handle({
      name: payload.name,
      permissions: payload.permissions as Permission[],
      executor: auth.getUserOrFail(),
    })

    return response.redirect().toRoute('roles.index')
  }

  public async edit({ auth, bouncer, inertia, params }: HttpContext) {
    const role = await Role.findOrFail(params.id)

    await bouncer.with(RolePolicy).authorize('update', role)

    return inertia.modal(
      'users/roles/edit',
      {
        role: RoleTransformer.transform(role).useVariant('forEdit'),
        grantablePermissions: await auth.getUserOrFail().getPermissions(),
      },
      { route: 'roles.index' }
    )
  }

  public async update({ auth, bouncer, params, request, response }: HttpContext) {
    const role = await Role.findOrFail(params.id)

    await bouncer.with(RolePolicy).authorize('update', role)

    const payload = await request.validateUsing(updateRoleValidator)

    await new UpdateRole().handle({
      target: role,
      name: payload.name,
      permissions: payload.permissions as Permission[],
      executor: auth.getUserOrFail(),
    })

    return response.redirect().toRoute('roles.index')
  }

  public async destroy({ bouncer, params, response }: HttpContext) {
    const role = await Role.findOrFail(params.id)

    await bouncer.with(RolePolicy).authorize('delete', role)

    await new DeleteRole().handle({ target: role })

    return response.redirect().toRoute('roles.index')
  }
}
