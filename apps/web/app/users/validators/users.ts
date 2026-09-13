import vine from '@vinejs/vine'

import { baseSearchValidator } from '#common/validators/search'

import User from '#users/models/user'
import { SORT_DIRECTIONS, USERS_SORT_BY } from '#users/enums/sort'

export const createUserValidator = vine.create({
  fullName: vine.string().trim().minLength(3).maxLength(255),
  email: vine.string().email().toLowerCase().trim().unique({ table: 'users', column: 'email' }),
  roles: vine.array(vine.string().uuid()).minLength(1),
  schoolId: vine.string().uuid().optional(),
})

export const editUserValidator = vine.withMetaData<{ userId: string }>().create({
  fullName: vine.string().trim().minLength(3).maxLength(255),
  email: vine
    .string()
    .email()
    .toLowerCase()
    .trim()
    .unique(async (_, value, field) => {
      const row = await User.query()
        .where('email', value)
        .whereNot('uuid', field.meta.userId)
        .first()
      return row ? false : true
    }),
  roles: vine.array(vine.string().uuid()).minLength(1),
  schoolId: vine.string().uuid().nullable().optional(),
})

export const listUserValidator = vine.create({
  ...baseSearchValidator.getProperties(),
  roles: vine.array(vine.string()).optional(),
  sort: vine.enum(USERS_SORT_BY).optional(),
  order: vine.enum(SORT_DIRECTIONS).optional(),
})
