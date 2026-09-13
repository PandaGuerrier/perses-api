import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'student_profiles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // The public key only ever belongs to a student, so it lives beside the
      // users table rather than as a column nobody else can fill in.
      table.uuid('user_uuid').primary().references('uuid').inTable('users').onDelete('CASCADE')
      table.string('public_key').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
