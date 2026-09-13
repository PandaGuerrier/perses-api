import type { HttpContext } from '@adonisjs/core/http'

import InviteSchoolMember from '#schools/actions/invite_school_member'
import RemoveSchoolMember from '#schools/actions/remove_school_member'
import RevokeSchoolInvitation from '#schools/actions/revoke_school_invitation'
import MemberNotFoundException from '#schools/exceptions/member_not_found'
import School from '#schools/models/school'
import SchoolInvitation from '#schools/models/school_invitation'
import MemberPolicy from '#schools/policies/member_policy'
import ListSchoolInvitations from '#schools/queries/list_school_invitations'
import ListSchoolMembers from '#schools/queries/list_school_members'
import SchoolInvitationTransformer from '#schools/transformers/school_invitation_transformer'
import SchoolTransformer from '#schools/transformers/school_transformer'
import { inviteMemberValidator, listMemberValidator } from '#schools/validators/members'
import { grantableRoles } from '#users/actions/sync_user_roles'
import User from '#users/models/user'
import RoleTransformer from '#users/transformers/role_transformer'
import UserTransformer from '#users/transformers/user_transformer'

export default class MembersController {
  public async index({ auth, bouncer, inertia, params, request }: HttpContext) {
    const school = await School.findOrFail(params.school_id)

    await bouncer.with(MemberPolicy).authorize('viewList', school)

    const payload = await request.validateUsing(listMemberValidator)

    const members = await new ListSchoolMembers().handle(
      {
        schoolUuid: school.uuid,
        q: payload.q,
        roles: payload.roles,
        sort: payload.sort,
        order: payload.order,
      },
      { page: payload.page ?? 1, perPage: payload.perPage ?? 10 }
    )

    const invitations = await new ListSchoolInvitations().handle({ schoolUuid: school.uuid })

    return inertia.render('schools/members/index', {
      school: SchoolTransformer.transform(school).useVariant('forEdit'),
      members: UserTransformer.paginate(members.all(), members.getMeta()).useVariant('forList'),
      invitations: SchoolInvitationTransformer.transform(invitations).useVariant('forList'),
      roles: RoleTransformer.transform(await grantableRoles(auth.getUserOrFail())).useVariant(
        'forList'
      ),
      q: payload.q,
      selectedRoles: payload.roles ?? [],
      sort: payload.sort ?? null,
      order: payload.order ?? null,
    })
  }

  public async store({ auth, bouncer, params, request, response }: HttpContext) {
    const school = await School.findOrFail(params.school_id)

    await bouncer.with(MemberPolicy).authorize('invite', school)

    const payload = await request.validateUsing(inviteMemberValidator)

    await new InviteSchoolMember().handle({
      school,
      email: payload.email,
      roleUuid: payload.roleId ?? null,
      executor: auth.getUserOrFail(),
    })

    return response.redirect().back()
  }

  public async destroy({ bouncer, params, response }: HttpContext) {
    const school = await School.findOrFail(params.school_id)
    const member = await User.findOrFail(params.id)

    if (member.schoolUuid !== school.uuid) throw new MemberNotFoundException()

    await bouncer.with(MemberPolicy).authorize('remove', school, member)

    await new RemoveSchoolMember().handle({ school, member })

    return response.redirect().back()
  }

  public async revokeInvitation({ bouncer, params, response }: HttpContext) {
    const school = await School.findOrFail(params.school_id)

    await bouncer.with(MemberPolicy).authorize('invite', school)

    const invitation = await SchoolInvitation.query()
      .where('uuid', params.id)
      .where('school_uuid', school.uuid)
      .firstOrFail()

    await new RevokeSchoolInvitation().handle({ target: invitation })

    return response.redirect().back()
  }
}
