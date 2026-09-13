import vine from '@vinejs/vine'

import { baseSearchValidator } from '#common/validators/search'
import { SORT_DIRECTIONS, USERS_SORT_BY } from '#users/enums/sort'

export const listMemberValidator = vine.create({
  ...baseSearchValidator.getProperties(),
  roles: vine.array(vine.string()).optional(),
  sort: vine.enum(USERS_SORT_BY).optional(),
  order: vine.enum(SORT_DIRECTIONS).optional(),
})

/** The admin only ever supplies an email — an account may not exist yet. */
export const inviteMemberValidator = vine.create({
  email: vine.string().email().toLowerCase().trim(),
  roleId: vine.string().uuid().nullable().optional(),
})
