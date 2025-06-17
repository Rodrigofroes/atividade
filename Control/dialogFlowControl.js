import ChamadoDAO from "../DAO/chamadoDAO.js";

export default class DialogFlowControl {
    constructor() {
        this.chamadosTemp = {};  // Armazena os dados temporários do usuário antes de salvar no banco
    }

    async DialogFlow(req, res) {
        const dados = req.body;
        const nomeIntencao = dados.queryResult.intent.displayName;
        const sessionId = dados.session;  // Único por usuário/atendimento

        console.log("Intenção recebida:", nomeIntencao);

        switch (nomeIntencao) {
            case "identificacao_servico":
                await this.identificarServico(dados, res, sessionId);
                break;
            case "confirmar_servico_adicional":
                await this.confirmarServicoAdicional(dados, res, sessionId);
                break;
            case "coleta_dados_usuario":
                await this.coletarDadosUsuario(dados, res, sessionId);
                break;
            case "confirmacao_chamado":
                await this.confirmarChamado(res, sessionId);
                break;
            case "consulta_status":
                await this.buscarChamadoPorNumero(dados, res);
                break;
            case "informacoes_adicionais":
                await this.informacoesAdicionais(res);
                break;
            default:
                this.respostaGenerica(res);
        }
    }

    async identificarServico(dados, res, sessionId) {
        const servico = dados.queryResult.parameters.servico;
        const prazos = {
            "Impressora": "6 horas",
            "Email": "2 horas",
            "ERP": "1 hora",
            "Internet": "30 minutos"
        };

        console.log(`Serviço solicitado: ${servico}`);

        if (!this.chamadosTemp[sessionId]) {
            this.chamadosTemp[sessionId] = { servicos: [] };
        }

        this.chamadosTemp[sessionId].servicos.push(servico);

        const prazo = prazos[servico] || "Prazo a definir";
        const respostaDF = {
            fulfillmentMessages: [{
                text: { text: [`Entendido, o prazo para atendimento do serviço '${servico}' é de até ${prazo}. Deseja solicitar suporte a mais algum serviço?`] }
            }]
        };
        res.status(200).json(respostaDF);
    }

    async confirmarServicoAdicional(dados, res, sessionId) {
        const confirmacao = dados.queryResult.parameters.confirmacao;

        if (confirmacao.toLowerCase() === "não") {
            const respostaDF = {
                fulfillmentMessages: [{
                    text: { text: ["Ok! Agora, por favor, informe seus dados pessoais (nome, matrícula, endereço e telefone) para registrar o chamado."] }
                }]
            };
            res.status(200).json(respostaDF);
        } else {
            const respostaDF = {
                fulfillmentMessages: [{
                    text: { text: ["Perfeito! Qual outro serviço você deseja adicionar?"] }
                }]
            };
            res.status(200).json(respostaDF);
        }
    }

    async coletarDadosUsuario(dados, res, sessionId) {
        const params = dados.queryResult.parameters;
        this.chamadosTemp[sessionId] = {
            ...this.chamadosTemp[sessionId],
            nome: params.nome,
            matricula: params.matricula,
            endereco: params.endereco,
            telefone: params.telefone
        };

        const respostaDF = {
            fulfillmentMessages: [{
                text: { text: ["Dados recebidos. Vou registrar o seu chamado agora!"] }
            }]
        };
        res.status(200).json(respostaDF);
    }

    async confirmarChamado(res, sessionId) {
        try {
            const chamado = this.chamadosTemp[sessionId];
            if (!chamado) {
                return this.respostaErro(res, "Não localizei dados para este atendimento.");
            }

            chamado.tecnico = this.selecionarTecnicoAleatorio();
            chamado.numero = Math.floor(Math.random() * 1000000);
            chamado.status = "Aberto";

            const chamadoDAO = new ChamadoDAO();
            await chamadoDAO.salvar(chamado);

            const respostaDF = {
                fulfillmentMessages: [{
                    text: {
                        text: [
                            `Entendido ${chamado.nome}. Seu chamado foi registrado com o número ${chamado.numero}. O técnico responsável será ${chamado.tecnico}.`
                        ]
                    }
                }]
            };

            delete this.chamadosTemp[sessionId];  // Limpa os dados temporários
            res.status(200).json(respostaDF);
        } catch (error) {
            console.error(error);
            this.respostaErro(res);
        }
    }

    async buscarChamadoPorNumero(dados, res) {
        try {
            const numero = dados.queryResult.parameters.numero;
            const chamadoDAO = new ChamadoDAO();
            const chamado = await chamadoDAO.obterChamadoPorNumero(numero);

            if (chamado) {
                const respostaDF = {
                    fulfillmentMessages: [{
                        text: {
                            text: [
                                `Chamado localizado.\nNúmero: ${chamado.numero}\nTécnico responsável: ${chamado.tecnico}\nStatus atual: ${chamado.status}.`
                            ]
                        }
                    }]
                };
                res.status(200).json(respostaDF);
            } else {
                const respostaDF = {
                    fulfillmentMessages: [{
                        text: { text: [`Chamado número ${numero} não encontrado.`] }
                    }]
                };
                res.status(200).json(respostaDF);
            }
        } catch (error) {
            console.error(error);
            this.respostaErro(res);
        }
    }

    async informacoesAdicionais(res) {
        const respostaDF = {
            fulfillmentMessages: [{
                text: {
                    text: [
                        "Nosso horário de atendimento é de segunda a sexta, das 8h às 18h. Você também pode entrar em contato pelo telefone (18) 99999-9999 ou pelo e-mail suporte@empresa.com.br."
                    ]
                }
            }]
        };
        res.status(200).json(respostaDF);
    }

    selecionarTecnicoAleatorio() {
        const tecnicos = ["Janaina Esteves", "Carlos Souza", "Mariana Lima", "João Pereira"];
        const index = Math.floor(Math.random() * tecnicos.length);
        return tecnicos[index];
    }

    respostaErro(res, msg = "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.") {
        const respostaDF = {
            fulfillmentMessages: [{
                text: { text: [msg] }
            }]
        };
        res.status(200).json(respostaDF);
    }

    respostaGenerica(res) {
        const respostaDF = {
            fulfillmentMessages: [{
                text: { text: ["Desculpe, não entendi sua solicitação. Por favor, reformule sua pergunta."] }
            }]
        };
        res.status(200).json(respostaDF);
    }
}
