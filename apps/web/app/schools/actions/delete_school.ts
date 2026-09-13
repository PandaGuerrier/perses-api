import type School from '#schools/models/school'

export interface DeleteSchoolInput {
  target: School
}

export default class DeleteSchool {
  async handle({ target }: DeleteSchoolInput): Promise<void> {
    await target.delete()
  }
}
