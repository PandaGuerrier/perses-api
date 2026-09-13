import { DateTime } from 'luxon'

import type School from '#schools/models/school'
import SchoolInvitation from '#schools/models/school_invitation'
import ManageRolesUnauthorizedException from '#users/exceptions/manage_roles_unauthorized'
import { grantableRoles } from '#users/actions/sync_user_roles'
import Role from '#users/models/role'
import User from '#users/models/user'

export interface InviteSchoolMemberInput {
  school: School
  email: string
  roleUuid: string | null
  executor: User
}

/**
 * Accounts are created by the OIDC provider, so the admin only ever supplies an
 * email. If it already matches an account we attach it right away; otherwise
 * the row waits for that person's first sign-in. The admin sees no difference.
 */
export default class InviteSchoolMember {
  async handle(input: InviteSchoolMemberInput): Promise<SchoolInvitation> {
    const email = input.email.toLowerCase()
    const role = input.roleUuid ? await Role.findOrFail(input.roleUuid) : null

    if (role) {
      const allowed = await grantableRoles(input.executor)
      if (!allowed.some((candidate) => candidate.uuid === role.uuid)) {
        throw new ManageRolesUnauthorizedException()
      }
    }

    const invitation = await SchoolInvitation.updateOrCreate(
      { schoolUuid: input.school.uuid, email },
      {
        schoolUuid: input.school.uuid,
        email,
        roleUuid: role?.uuid ?? null,
        invitedByUuid: input.executor.uuid,
        acceptedAt: null,
      }
    )

    const existing = await User.query().whereILike('email', email).first()
    if (existing) {
      existing.schoolUuid = input.school.uuid
      await existing.save()
      if (role) await existing.syncRoles([role])

      invitation.acceptedAt = DateTime.now()
      await invitation.save()
    }

    return invitation
  }
}
