import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Images extends BaseSchema {
  protected tableName = 'images'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('url').notNullable()
      table.boolean('default')
      table.integer('ad_id').unsigned().notNullable().references('id').inTable('ads').onDelete('CASCADE').onUpdate('CASCADE')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
// Se apagarmos um anuncio, a imagem vai junto
