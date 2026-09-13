import string from '@adonisjs/core/helpers/string'

import Group from '#schools/models/group'

export interface CreateGroupInput {
  schoolUuid: string
  name: string
}

export default class CreateGroup {
  async handle(input: CreateGroupInput): Promise<Group> {
    return Group.create({
      schoolUuid: input.schoolUuid,
      name: input.name,
      slug: await uniqueGroupSlug(input.schoolUuid, input.name),
    })
  }
}

/** Slugs are unique per school, not globally — two schools may both have "L1". */
export async function uniqueGroupSlug(
  schoolUuid: string,
  name: string,
  ignoreUuid?: string
): Promise<string> {
  const base = string.slug(name, { lower: true })
  let candidate = base
  let suffix = 2

  while (true) {
    const query = Group.query().where('school_uuid', schoolUuid).where('slug', candidate)
    if (ignoreUuid) query.whereNot('uuid', ignoreUuid)
    if (!(await query.first())) return candidate
    candidate = `${base}-${suffix++}`
  }
}
