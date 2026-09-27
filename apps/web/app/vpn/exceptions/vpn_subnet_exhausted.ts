import { Exception } from '@adonisjs/core/exceptions'

export default class VpnSubnetExhaustedException extends Exception {
  static status = 503
  static code = 'E_VPN_SUBNET_EXHAUSTED'

  constructor() {
    super('No address left in the VPN subnet.')
  }
}
