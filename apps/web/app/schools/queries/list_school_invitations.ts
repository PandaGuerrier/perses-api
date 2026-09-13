import SchoolInvitation from '#schools/models/school_invitation'

export interface ListSchoolInvitationsInput {
  schoolUuid: string
}

export default class ListSchoolInvitations {
  async handle({ schoolUuid }: ListSchoolInvitationsInput): Promise<SchoolInvitation[]> {
    return SchoolInvitation.query()
      .where('school_uuid', schoolUuid)
      .whereNull('accepted_at')
      .preload('role')
      .orderBy('created_at', 'desc')
      .orderBy('uuid', 'asc')
  }
}
