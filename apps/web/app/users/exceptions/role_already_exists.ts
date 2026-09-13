import { Exception } from '@adonisjs/core/exceptions'

export default class RoleAlreadyExistsException extends Exception {
  static status = 422
  static code = 'E_ROLE_ALREADY_EXISTS'

  constructor(name: string) {
    super(`A role named "${name}" already exists in this school.`)
  }
}
