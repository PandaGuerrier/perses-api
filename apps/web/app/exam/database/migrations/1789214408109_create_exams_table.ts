import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exams'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('uuid').primary()
      table
        .uuid('school_uuid')
        .notNullable()
        .references('uuid')
        .inTable('schools')
        .onDelete('CASCADE')
        .index()
      table
        .uuid('created_by_uuid')
        .nullable()
        .references('uuid')
        .inTable('users')
        .onDelete('SET NULL')
      table.string('title', 191).notNullable()
      table.text('description').nullable()
      table.timestamp('starts_at').notNullable().index()
      table.timestamp('ends_at').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
