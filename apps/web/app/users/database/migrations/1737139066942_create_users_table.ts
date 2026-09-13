import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('uuid').primary()
      table.string('full_name').nullable()
      table.string('ferris_uuid').nullable().index()
      table.string('email').notNullable().index()
      // null for a super-admin, who sits above every organisation.
      table
        .uuid('school_uuid')
        .nullable()
        .references('uuid')
        .inTable('schools')
        .onDelete('SET NULL')
        .index()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
