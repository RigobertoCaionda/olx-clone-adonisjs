import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Ads extends BaseSchema {
  protected tableName = 'ads'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('title').notNullable()
      table.float('price').notNullable()
      table.boolean('price_negotiable')
      table.text('description', 'longtext')
      table.integer('views').notNullable()
      table.boolean('status')
      table.integer('category_id').unsigned().notNullable().references('id').inTable('categories')
      table.integer('state_id').unsigned().notNullable().references('id').inTable('states')
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
