import ConsumeSchoolInvitation from '#schools/actions/consume_school_invitation'
import { ROLES } from '#users/enums/role'
import Role from '#users/models/role'
import User from '#users/models/user'

export interface ResolveOidcUserInput {
  ferrisUuid: string
  fullName: string | null
  email: string | null
}

/**
 * Ferriskey is the only account source. A brand new account starts as a student
 * with no school; an admin's pending invitation is what attaches it to one.
 */
export default class ResolveOidcUser {
  async handle(input: ResolveOidcUserInput): Promise<User> {
    const existing = await User.query().where('ferris_uuid', input.ferrisUuid).first()

    const user =
      existing ??
      (await User.create({
        ferrisUuid: input.ferrisUuid,
        fullName: input.fullName ?? '',
        email: input.email ?? '',
        schoolUuid: null,
      }))

    if (existing) {
      existing.merge({
        fullName: input.fullName ?? existing.fullName,
        email: input.email ?? existing.email,
      })
      await existing.save()
    } else {
      const student = await Role.query()
        .where('name', ROLES.STUDENT)
        .whereNull('school_uuid')
        .first()
      if (student) await user.assignRole(student)
    }

    await new ConsumeSchoolInvitation().handle({ user })

    return user
  }
}
