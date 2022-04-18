import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import State from 'App/Models/State';
import User from 'App/Models/User';

export default class AuthController {
    public async signup ({ request, auth, response }: HttpContextContract) {
        const { email, name, password, stateId } = request.all();

        if (!email) {
            return {  error: 'preencha o email'};
        }
        if (!name) {
            return {  error: 'preencha o nome'};
        }
        if (!password) { // A password já é encriptada automaticamente
            return {  error: 'preencha a senha'};
        }
        if (!stateId) {
            return {  error: 'preencha a província' };
        }

        let user = await User.findBy('email', email); // Para achar dados por um campo especifico

        if (user) {
            response.status(401);
            return {  error: 'email já existe'};
        }

        let state = await State.find(stateId);
        if (!state) {
            response.status(404);
            return { error: 'Província inválida' };
        }
        await User.create({ email, password, name, stateId }); // Se passar por aqui vai para baixo
        const token = await auth.attempt(email, password, { // Isso é so para enviar ja o token
            expiresIn: '2 days'
        });

        return token;
 }

 public async signin ({ request, auth }: HttpContextContract) {
    const { email, password } = request.all();
    const token = await auth.attempt(email, password, {
        expiresIn: '2 days'
    });

    return token;
}


public async signout ({ auth }: HttpContextContract) {
    auth.logout();
}


}
