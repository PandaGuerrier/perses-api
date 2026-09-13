import { Exception } from '@adonisjs/core/exceptions'

import type { Permission } from '#users/enums/permission'

export default class PermissionEscalationException extends Exception {
  static status = 403
  static code = 'E_PERMISSION_ESCALATION'

  constructor(permissions: Permission[]) {
    super(`You cannot grant permissions you do not hold: ${permissions.join(', ')}.`)
  }
}
