import ChamadoDAO from "../DAO/chamadoDAO.js";

export default class ChamadoControl {
    async salvar(req, res) {
        try {
            const { nome, descricao } = req.body;
            if (nome && descricao) {
                const chamadoDAO = new ChamadoDAO();
                const chamado = {
                    nome,
                    descricao,
                    status: "Aberto",
                    numero: Math.floor(Math.random() * 1000000)
                }
                const id = await chamadoDAO.salvar(chamado);
                res.status(200).send({ id });
            } else {
                res.status(400).send({ message: "Nome e descrição são obrigatórios" });
            }
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async listar(req, res) {
        try {
            const chamadoDAO = new ChamadoDAO();
            const chamados = await chamadoDAO.buscarTodos();
            res.status(200).send(chamados);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, descricao, status } = req.body;
            if (nome && descricao && status) {
                const chamadoDAO = new ChamadoDAO();
                const chamado = {
                    nome,
                    descricao,
                    status
                }
                await chamadoDAO.atualizar(id, chamado);
                res.status(200).send({ message: "Chamado atualizado com sucesso" });
            } else {
                res.status(400).send({ message: "Nome, descrição e status são obrigatórios" });
            }
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async deletar(req, res) {
        try {
            const { id } = req.params;
            const chamadoDAO = new ChamadoDAO();
            await chamadoDAO.deletar(id);
            res.status(200).send({ message: "Chamado deletado com sucesso" });
        } catch (error) {
            res.status(500).send(error);
        }
    }
}