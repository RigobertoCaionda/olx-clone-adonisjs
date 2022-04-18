import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import State from 'App/Models/State';

export default class StateSeederSeeder extends BaseSeeder {
  public async run () {
    await State.create({
      name: 'Luanda'
    }); 

    await State.create({
      name: 'Benguela'
    }); 

    await State.create({
      name: 'Cuanza Sul'
    }); 
  }
}
