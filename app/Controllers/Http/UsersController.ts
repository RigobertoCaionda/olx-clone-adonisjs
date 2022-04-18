import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import State from 'App/Models/State';
import User from 'App/Models/User';

export default class UsersController {
    public async me ({ auth, response }: HttpContextContract) {
        let user = auth.user;
        if (!user) {
            response.status(404);
            return { error: 'usuário não encontrado!' };
        }
        await user.load('state'); // Nunca te esquecas do await
        return user;
    }

    public async getUsers ({}: HttpContextContract) {
       const users =  await User.query().select('*').preload('state'); // Traz o user e a sua provincia
        return users;
    }

    public async getUser ({ params, response }: HttpContextContract) {
        const id = params.id;

        const user =  await User.find(id);

        if (!user) {
            response.status(404);
            return { error: 'usuário não encontrado!' };
        }
        await user.load('state');

         return user;
     }

     public async editAction ({ auth, request, response }: HttpContextContract) {
        let user = await User.find(auth.user?.id); // So para garantir
        
        if (!user) { // Nao precisa pq se chegou aqui e pq o user existe, quando um user é deletado, o seu token vai junto
            response.notFound();
            return { error: 'usuário não encontrado!' };
        }
        const userData = request.only(['name', 'email', 'password', 'stateId']);
        if (userData.stateId) {
            const state = await State.find(userData.stateId);
            if (!state) {
                response.status(404);
                return { error: 'Estado inexistente!' };
            }
        }

        user.merge(userData);
        await user.save();
        await user.load('state');
        return user; // Ele nao aceita assim: user.load('state'), primeiro vc cria o load e depois retorna o user
     }

     public async deleteAction ({ auth, response }: HttpContextContract) {
        const user = auth.user;

        if (!user) {
            response.status(404);
            return { error: 'Usuário inexistente' };
        }
       await user.delete();
     }
}
