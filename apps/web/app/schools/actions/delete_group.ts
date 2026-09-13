import type Group from '#schools/models/group'

export interface DeleteGroupInput {
  target: Group
}

export default class DeleteGroup {
  async handle({ target }: DeleteGroupInput): Promise<void> {
    await target.delete()
  }
}
