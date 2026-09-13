import { DateTime } from 'luxon'

import SchoolInvitation from '#schools/models/school_invitation'
import Role from '#users/models/role'
import type User from '#users/models/user'

export interface ConsumeSchoolInvitationInput {
  user: User
}

/** Runs on every OIDC sign-in; a no-op when nothing is pending. */
export default class ConsumeSchoolInvitation {
  async handle({ user }: ConsumeSchoolInvitationInput): Promise<SchoolInvitation | null> {
    if (!user.email) return null

    const invitation = await SchoolInvitation.query()
      .whereILike('email', user.email)
      .whereNull('accepted_at')
      .orderBy('created_at', 'asc')
      .first()

    if (!invitation) return null

    user.schoolUuid = invitation.schoolUuid
    await user.save()

    if (invitation.roleUuid) {
      const role = await Role.find(invitation.roleUuid)
      if (role) await user.syncRoles([role])
    }

    invitation.acceptedAt = DateTime.now()
    await invitation.save()

    return invitation
  }
}
