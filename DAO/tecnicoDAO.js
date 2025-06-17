import Tecnico from "../Model/tecnicoModel.js";

export default class TecnicoDAO {
    async salvar(tecnico) {
        try {
            const novoTecnico = await Tecnico.create(tecnico);
            return novoTecnico.id;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async buscar(id) {
        try {
            return await Tecnico.findByPk(id);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async buscarTodos() {
        try {
            return await Tecnico.findAll();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async atualizar(id, tecnico) {
        try {
            return await Tecnico.update(tecnico, {
                where: { id: id }
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async deletar(id) {
        try {
            return await Tecnico.destroy({
                where: { id: id }
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}