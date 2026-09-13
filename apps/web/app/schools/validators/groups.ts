import vine from '@vinejs/vine'

import { baseSearchValidator } from '#common/validators/search'

export const createGroupValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(191),
})

export const editGroupValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(191),
})

export const listGroupValidator = vine.create({
  ...baseSearchValidator.getProperties(),
})

export const syncGroupStudentsValidator = vine.create({
  students: vine.array(vine.string().uuid()).distinct(),
})
