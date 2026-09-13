import vine from '@vinejs/vine'

import { baseSearchValidator } from '#common/validators/search'

export const createSchoolValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(191),
  description: vine.string().trim().maxLength(2000).nullable().optional(),
})

export const editSchoolValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(191),
  description: vine.string().trim().maxLength(2000).nullable().optional(),
})

export const listSchoolValidator = vine.create({
  ...baseSearchValidator.getProperties(),
})
