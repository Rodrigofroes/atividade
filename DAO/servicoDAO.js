import Servico from "../Model/servicoModel.js";

export default class ServicoDAO {
    async salvar(servico) {
        try {
            const novoServico = await Servico.create(servico);
            return novoServico.id;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async buscar(id) {
        try {
            return await Servico.findByPk(id);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async buscarTodos() {
        try {
            return await Servico.findAll();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async buscarPorNome(nome) {
        try {
            return await Servico.findOne({
                where: { nome: nome }
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async atualizar(id, servico) {
        try {
            return await Servico.update(servico, {
                where: { id: id }
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async deletar(id) {
        try {
            return await Servico.destroy({
                where: { id: id }
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}