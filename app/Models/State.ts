import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Ad from './Ad'

export default class State extends BaseModel {

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relacoes
  @hasMany(() => User)
  public user: HasMany<typeof User> // Estamos dizendo que um Estado tem muitos users

  @hasMany(() => Ad)
  public ad: HasMany<typeof Ad>
}
