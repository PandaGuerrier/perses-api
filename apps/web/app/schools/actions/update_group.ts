import { uniqueGroupSlug } from '#schools/actions/create_group'
import type Group from '#schools/models/group'

export interface UpdateGroupInput {
  target: Group
  name: string
}

export default class UpdateGroup {
  async handle(input: UpdateGroupInput): Promise<Group> {
    input.target.merge({
      name: input.name,
      slug: await uniqueGroupSlug(input.target.schoolUuid, input.name, input.target.uuid),
    })
    await input.target.save()

    return input.target
  }
}
