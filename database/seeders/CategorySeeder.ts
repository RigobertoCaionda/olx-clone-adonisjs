import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Category from 'App/Models/Category';

export default class CategorySeederSeeder extends BaseSeeder {
  public async run () {
    await Category.create({
      name: 'Carros',
      slug: 'cars',
      img: '/uploads/C:/Adonis-Projects/olx-adonis-relationed/tmp/uploads/cars.png'
    });

    await Category.create({
      name: 'Eletrónicos',
      slug: 'electronics',
      img: '/uploads/C:/Adonis-Projects/olx-adonis-relationed/tmp/uploads/electronics.png'
    }); 

    await Category.create({
      name: 'Bebés',
      slug: 'baby',
      img: '/uploads/C:/Adonis-Projects/olx-adonis-relationed/tmp/uploads/baby.png'
    }); 

    await Category.create({
      name: 'Roupas',
      slug: 'clothes',
      img: '/uploads/C:/Adonis-Projects/olx-adonis-relationed/tmp/uploads/clothes.png'
    }); 
  }
}
