import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'groups'

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
      table.string('name', 191).notNullable()
      table.string('slug', 191).notNullable()
      table.unique(['school_uuid', 'slug'])

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
