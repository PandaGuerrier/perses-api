import string from '@adonisjs/core/helpers/string'

import School from '#schools/models/school'

export interface CreateSchoolInput {
  name: string
  description: string | null
}

export default class CreateSchool {
  async handle(input: CreateSchoolInput): Promise<School> {
    return School.create({
      name: input.name,
      slug: await uniqueSlug(input.name),
      description: input.description,
    })
  }
}

/** The slug is part of the URL contract, so collisions get a numeric suffix. */
export async function uniqueSlug(name: string, ignoreUuid?: string): Promise<string> {
  const base = string.slug(name, { lower: true })
  let candidate = base
  let suffix = 2

  while (true) {
    const query = School.query().where('slug', candidate)
    if (ignoreUuid) query.whereNot('uuid', ignoreUuid)
    if (!(await query.first())) return candidate
    candidate = `${base}-${suffix++}`
  }
}
