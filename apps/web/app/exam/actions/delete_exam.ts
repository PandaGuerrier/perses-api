import type Exam from '#exam/models/exam'

export interface DeleteExamInput {
  target: Exam
}

export default class DeleteExam {
  async handle({ target }: DeleteExamInput): Promise<void> {
    await target.delete()
  }
}
