import type SchoolInvitation from '#schools/models/school_invitation'

export interface RevokeSchoolInvitationInput {
  target: SchoolInvitation
}

export default class RevokeSchoolInvitation {
  async handle({ target }: RevokeSchoolInvitationInput): Promise<void> {
    await target.delete()
  }
}
