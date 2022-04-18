import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Application from '@ioc:Adonis/Core/Application';
import Ad from 'App/Models/Ad';
import Category from 'App/Models/Category';
import State from 'App/Models/State';
import Drive from '@ioc:Adonis/Core/Drive';
import { unlink } from 'fs/promises';
import Env from '@ioc:Adonis/Core/Env'; // Variaveis de ambiente

type dataType = {
    title: string,
     status: boolean, 
     price: number, 
     priceNegotiable: boolean, 
     description: string,
     stateId?: number,
     categoryId?: number
};
export default class AdsController {
    public async addAction ({ request, auth, response }: HttpContextContract) {
        const { title, price, priceNeg, description, categoryId, stateId } = request.
            only(['title', 'price', 'priceNeg', 'description', 
            'categoryId', 'stateId', 'imgs']);

        const images = request.files('imgs', {
            size: '2mb',
            extnames: ['jpg', 'png']
        }); 

        if (!title) { return { error: 'preencha o título' };  }
        if (!price) {return { error: 'preencha o preço' }; }
        if (!categoryId) {return { error: 'preencha a categoria' }; }
        if (!stateId) { return { error: 'preencha a província' }; }

        const category = await Category.find(categoryId);
        if (!category) {  
            response.status(404);
            return { error: 'Categoria inexistente!' };
         }

        const state = await State.find(stateId);
        if (!state) {
            response.status(404);
            return { error: 'Província inexistente!' }; 
        }

        if (images.length > 0) { // Repeti isso aqui para que ele nem se quer faca as coisas que estao em baixo caso a foto dele nao for válida
            for (let image of images) {
                if (!image.isValid) {
                    return image.errors
                }
            }
         }
         
        let ad = await Ad.create({
            title,
            price,
            priceNegotiable: priceNeg == 'true' ? true : false,
            description,
            views: 0,
            status: true,
            categoryId,
            stateId,
            userId: auth.user?.id
            });
    
           if (images.length > 0) {
                for (let [index, image] of images.entries()) { // Forma para obter o index no for of
                    if (!image.isValid) {
                        return image.errors
                    } // Se nao for imagem, ele nem vai uploadar nem vai para a bd
                    await image.move(Application.tmpPath('uploads'), {  // Se for uma img coloca a imagem na pasta e em seguida salva o nome na bd
                        name: image.clientName,
                        overwrite: true 
                    });
                    await ad.related('image').create({ url: image.clientName, adId: ad.id, 
                            default: index == 0 ? true : false }); // Criando a imagem relacionada a esse anuncio
                }
           }

           return { id: ad.id };
    }

    public async getList ({ request }: HttpContextContract) {
        const { sort = 'asc', page = 1, limit = 2  } = request.only(['sort', 'page', 'limit']);
       let adsData = await Ad.query().preload('category')
       .preload('state').preload('user').preload('image').orderBy('id', sort).paginate(page, limit); // O Adonis é tao inteligente que ele já retorna quantas paginas sao, tudo que vc precisa, so deves passar para ele o limit e o numero de paginas
       let adsTotal = adsData.toJSON(); // Transformando o resultado em json, vc precisa transformar em json, caso contrario vc nao podera acessar as propriedades
       for (let data of adsTotal.data) {
           for (let img of data.image) {
                const url = await Drive.getUrl(img.url);
                img.url = `${Env.get('baseUrl')}${url}`;
           }
       }
       return adsTotal;
    }

    public async search ({ request }: HttpContextContract) { // Como pesquisar mais de um item.
        const { title } = request.only(['title']);
        let ad: Ad[] = [];
        if (title) {
            ad = await Ad.query().where('title', 'like', '%'+title+'%');
        }
        return ad; // retorna um array com os dados
    }

    public async getItem ({ params, response }: HttpContextContract) {
        const id = params.id;
        let ad = await Ad.find(id);

        if (!ad) {
            response.status(404);
            return { error: 'Anúncio inexistente' };
        }

        await ad.load((loader) => {
            loader.load('category').load('state').load('user').load('image')
        }); // Carregando varios loads, é só passar uma funcao callback.

        ad.views++;
        await ad.save();

        for (let img of ad.image) {
            const url = await Drive.getUrl(img.url);
            img.url = `${Env.get('baseUrl')}${url}`;
        }

        return ad;
    }

    public async editAction ({ params, request, auth, response }: HttpContextContract) {
        const id = params.id;
        let { 
            title, status, price, 
            priceneg, desc, categoryId, stateId } = request.only(['title', 'status', 'price', 'priceneg', 'desc', 'categoryId', 'stateId']);
            let data: dataType = { title, status, price, priceNegotiable: priceneg, description: desc };
            if (stateId) {
                const state = await State.find(stateId);
                if (!state) {
                    response.status(404);
                    return { error: 'Estado inexistente!' };
                } else {
                    data.stateId = stateId;
                }
            }

            if (categoryId) {
                const category = await Category.find(categoryId);
                if (!category) {
                    response.status(404);
                    return { error: 'Categoria inexistente!' };
                } else {
                    data.categoryId = categoryId;
                }
            }

            let ad = await Ad.find(id);
            if (!ad) { 
                response.status(404);
                return { error: 'Anúncio inexistente!'  };
             }
            if (ad.userId !== auth.user?.id) { 
                response.status(401); 
                return { error: 'Este anúncio não é seu!' }; 
            }
            
            ad.merge(data);
            await ad.save();
            await ad.load((loader) => {
                loader.load('category').load('state').load('user').load('image')
            });

            for (let img of ad.image) {
                const url = await Drive.getUrl(img.url);
                img.url = `${Env.get('baseUrl')}${url}`;
            }
            return ad;
    }

    public async deleteAction ({ auth, params, response }: HttpContextContract) {
        const id = params.id;
        const user = auth.user;
        const ad = await Ad.find(id);
        
        if (ad) {
            if (ad.userId !== user?.id) {
                response.status(401);
                return { error: 'Este anúncio não é seu!' };
            }
        } else {
            response.status(404);
            return { error: 'Anúncio inexistente!' };
        }
        await ad.load('image');
        
        for (let i = 0; i < ad.image.length; i++) {
            unlink(`./tmp/uploads/${ad.image[i].url}`);
        }
       await ad.delete(); // Apaga junto com as imagens devido ao seu relacionamento
    }
}
