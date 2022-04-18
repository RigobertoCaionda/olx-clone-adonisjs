import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import State from 'App/Models/State'

export default class StatesController {
    async getStates ({  }: HttpContextContract) {
        const states = State.all();
        return states; // So funciona se eu retornar diretamente assim, qual a diferenca entre .json, .send e retorno normal?
    }

}
