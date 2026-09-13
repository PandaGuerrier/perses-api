import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cheats'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('uuid').primary()
      table
        .uuid('user_uuid')
        .notNullable()
        .references('uuid')
        .inTable('users')
        .onDelete('CASCADE')
        .index()
      table.string('domain')
      table.timestamp('observed_at')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
