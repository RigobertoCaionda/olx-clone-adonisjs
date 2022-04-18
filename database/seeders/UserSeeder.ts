import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
//import State from 'App/Models/State';
import User from 'App/Models/User';

export default class UserSeederSeeder extends BaseSeeder {
  public async run () {
      await User.create({
      name: 'Rigoberto Caionda',
      email: 'rigobertocaionda98@gmail.com',
      password: '123',
      stateId: 1
    }); 

    // await user.related('state').associate((await State.create({ name: 'fererer' }))); // Cria o user e o seu estado junto
    // await  user.load('state'); Como o user já está carregado, então nao precisa de preload
    // await User.query().select('*').preload('state'); Trazendo o estado com o user associado

  }
}
