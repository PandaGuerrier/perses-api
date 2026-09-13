import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exam_users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .uuid('exam_uuid')
        .notNullable()
        .references('uuid')
        .inTable('exams')
        .onDelete('CASCADE')
        .index()
      table
        .uuid('user_uuid')
        .notNullable()
        .references('uuid')
        .inTable('users')
        .onDelete('CASCADE')
        .index()
      table.unique(['exam_uuid', 'user_uuid'])

      table.timestamp('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
