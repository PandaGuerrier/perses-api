import { uniqueSlug } from '#schools/actions/create_school'
import type School from '#schools/models/school'

export interface UpdateSchoolInput {
  target: School
  name: string
  description: string | null
}

export default class UpdateSchool {
  async handle(input: UpdateSchoolInput): Promise<School> {
    input.target.merge({
      name: input.name,
      description: input.description,
      slug: await uniqueSlug(input.name, input.target.uuid),
    })
    await input.target.save()

    return input.target
  }
}
