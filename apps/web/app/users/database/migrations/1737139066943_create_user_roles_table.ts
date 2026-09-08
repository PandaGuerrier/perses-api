import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .uuid('user_uuid')
        .notNullable()
        .unsigned()
        .references('uuid')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .uuid('role_uuid')
        .notNullable()
        .unsigned()
        .references('uuid')
        .inTable('roles')
        .onDelete('CASCADE')
      table.unique(['user_uuid', 'role_uuid'])
      table.timestamp('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
