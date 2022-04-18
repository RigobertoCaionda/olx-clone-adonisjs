import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category';
import Drive from '@ioc:Adonis/Core/Drive';
import Env from '@ioc:Adonis/Core/Env'; // Variaveis de ambiente

export default class CategoriesController {
    public async getCategories ({  }: HttpContextContract) {
        const categories = await Category.all();

        for (let category of categories) {
            const url = await Drive.getUrl(category.img); // Vc passa apenas o nome e ele te dá um caminho que concatenado com a baseUrl retorna a imagem. Na bd, vc so passa o nome da imagem.
            category.img = `${Env.get('baseUrl')}${url}`;
        }
        return categories; // Assim retorna ja o array direito, se vc poe assim: { categories }, vai retornar o array dentro de um objeto
    }
}
