import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'school_invitations'

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
      table.string('email', 254).notNullable().index()
      table.uuid('role_uuid').nullable().references('uuid').inTable('roles').onDelete('SET NULL')
      table
        .uuid('invited_by_uuid')
        .nullable()
        .references('uuid')
        .inTable('users')
        .onDelete('SET NULL')
      table.timestamp('accepted_at').nullable()
      table.unique(['school_uuid', 'email'])

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
