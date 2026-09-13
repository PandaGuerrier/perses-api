import { Exception } from '@adonisjs/core/exceptions'

export default class MemberNotFoundException extends Exception {
  static status = 404
  static code = 'E_MEMBER_NOT_FOUND'

  constructor() {
    super('This member does not belong to the school.')
  }
}
