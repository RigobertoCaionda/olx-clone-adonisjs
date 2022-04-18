import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import State from './State';
import Ad from './Ad';

export default class User extends BaseModel {
  
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public name: string

  @column()
  public stateId: number // Olha que na bd é state_id, mas aqui é stateId

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @belongsTo(() => State)
  public state: BelongsTo<typeof State> // Estamos a criar um relacionamento de nome state, dizendo que um usuario pertence a um estado, devemos colocar a relacao nos 2 lados.
  
  @hasMany(() => Ad)
  public ad: HasMany<typeof Ad>
}
