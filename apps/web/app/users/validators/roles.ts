import vine from '@vinejs/vine'

import { ALL_PERMISSIONS } from '#users/enums/permission'

const permissionValues = ALL_PERMISSIONS as unknown as string[]

export const createRoleValidator = vine.create({
  name: vine.string().trim().minLength(3).maxLength(191),
  permissions: vine.array(vine.enum(permissionValues)).distinct(),
})

export const updateRoleValidator = vine.create({
  name: vine.string().trim().minLength(3).maxLength(191),
  permissions: vine.array(vine.enum(permissionValues)).distinct(),
})
