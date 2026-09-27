import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vpn_peers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('uuid').primary()
      table
        .uuid('user_uuid')
        .notNullable()
        .unique()
        .references('uuid')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('public_key', 44).notNullable().unique()
      table.string('address', 15).notNullable().unique()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
