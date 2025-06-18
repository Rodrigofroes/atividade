import Chamado from "../Model/chamadoModel.js";
import Tecnico from "../Model/tecnicoModel.js";

export default class ChamadoDAO {
    async salvar(chamado) {
        try {
            const novoChamado = await Chamado.create(chamado);
            return novoChamado.id;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async buscar(id) {
        try {
            return await Chamado.findByPk(id);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async buscarTodos() {
        try {
            return await Chamado.findAll();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async atualizar(id, chamado) {
        try {
            return await Chamado.update(chamado, {
                where: { id: id }
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async deletar(id) {
        try {
            return await Chamado.destroy({
                where: { id: id }
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async obterChamadoPorNumero(numero) {
        try {
            return await Chamado.findOne({
                where: { numero: numero },
                include: [{
                    model: Tecnico,
                    attributes: ['nome'] 
                }]
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}