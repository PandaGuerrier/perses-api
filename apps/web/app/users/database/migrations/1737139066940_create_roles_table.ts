import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('uuid').primary()
      table.string('name', 191).notNullable()
      // null for the four built-in roles, set for roles an admin created in
      // their own school — hence a composite unique rather than a unique name.
      table
        .uuid('school_uuid')
        .nullable()
        .references('uuid')
        .inTable('schools')
        .onDelete('CASCADE')
        .index()
      table.boolean('is_system').notNullable().defaultTo(false)
      table.jsonb('permissions').notNullable().defaultTo('[]')
      table.unique(['school_uuid', 'name'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
