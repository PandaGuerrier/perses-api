import vine from '@vinejs/vine'

import { baseSearchValidator } from '#common/validators/search'

const examProperties = {
  title: vine.string().trim().minLength(2).maxLength(191),
  description: vine.string().trim().maxLength(2000).nullable().optional(),
  startsAt: vine.date({ formats: { utc: true } }),
  // `afterField` compares whole days by default, which would reject an exam
  // that starts and ends the same morning.
  endsAt: vine.date({ formats: { utc: true } }).afterField('startsAt', { compare: 'minute' }),
  students: vine.array(vine.string().uuid()).distinct(),
}

export const createExamValidator = vine.create({ ...examProperties })

export const editExamValidator = vine.create({ ...examProperties })

export const listExamValidator = vine.create({
  ...baseSearchValidator.getProperties(),
})
