import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import State from './State'
import Category from './Category';
import User from './User';
import Image from './Image';

export default class Ad extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public price: number

  @column()
  public priceNegotiable: boolean

  @column()
  public description: string

  @column()
  public views: number

  @column()
  public status: boolean

  @column()
  public categoryId: number

  @column()
  public stateId: number

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relacoes
  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>

  @belongsTo(() => State)
  public state: BelongsTo<typeof State>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => Image)
  public image: HasMany<typeof Image>
}
