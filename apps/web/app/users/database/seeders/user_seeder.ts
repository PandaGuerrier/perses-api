import { BaseSeeder } from '@adonisjs/lucid/seeders'

import Role from '#users/models/role'
import User from '#users/models/user'

import { ALL_PERMISSIONS } from '#users/enums/permission'
import { ROLES } from '#users/enums/role'

export default class UserSeeder extends BaseSeeder {
  async run() {
    const adminRole = await Role.updateOrCreate(
      { name: ROLES.ADMIN },
      { permissions: ALL_PERMISSIONS }
    )
    await adminRole.syncPermissions(ALL_PERMISSIONS)

    await Role.updateOrCreate({ name: ROLES.USER }, { permissions: [] })

    const admin = await User.updateOrCreate(
      { fullName: 'julio' },
      { fullName: 'julio', publicKey: 'MgeopD5IZx6znXPiOzvuaw2j9NBJhGd+ijnu60pDcTM=', ferrisUuid: '1234567890' }
    )

    await admin.assignRole(adminRole)
  }
}
