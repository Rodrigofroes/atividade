import ChamadoDAO from "../DAO/chamadoDAO.js";
import ServicoDAO from "../DAO/servicoDAO.js";

export default class DialogFlowControl {
    constructor() {
        this.chamadosTemp = {};  // Dados temporários por sessão
    }

    async DialogFlow(req, res) {
        const dados = req.body;
        const nomeIntencao = dados.queryResult.intent.displayName;
        const sessionId = dados.session;

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
            case "CapturarNumeroChamado":
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
        const servicoDAO = new ServicoDAO();
        const servicoExistente = await servicoDAO.buscarPorNome(servico);

        if (!servicoExistente) {
            return this.respostaErro(res, `O serviço '${servico}' não está cadastrado. Por favor, verifique o nome e tente novamente.`);
        }

        console.log(`Serviço solicitado: ${servico}`);

        if (!this.chamadosTemp[sessionId]) {
            this.chamadosTemp[sessionId] = { servicos: [] };
        }

        this.chamadosTemp[sessionId].servicos.push(servico);

        const prazo = this.formatarPrazoEmHoras(servicoExistente.prazo);
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

        if (!this.chamadosTemp[sessionId]) {
            return this.respostaErro(res, "Nenhum serviço foi identificado antes de coletar os dados do usuário.");
        }

        console.log(this.chamadosTemp[sessionId] = {
            ...this.chamadosTemp[sessionId],
            usuario_nome: params.nome?.name || params.nome,
            usuario_matricula: params.matricula,
            usuario_endereco: params.endereco,
            usuario_telefone: params.telefone,
            tecnico: this.selecionarTecnicoAleatorio(),
            numero: Math.floor(Math.random() * 1000000),
            status: "Aberto"
        });

        const chamado = this.chamadosTemp[sessionId];
        chamado.servicos = chamado.servicos.join(", ");
        try {
            const chamadoDAO = new ChamadoDAO();
            await chamadoDAO.salvar(chamado);

            const respostaDF = {
                fulfillmentMessages: [{
                    text: {
                        text: [
                            `Entendido ${chamado.usuario_nome}. Seu chamado foi registrado com o número ${chamado.numero}. O técnico responsável será ${chamado.tecnico}.`
                        ]
                    }
                }]
            };

            delete this.chamadosTemp[sessionId];
            res.status(200).json(respostaDF);
        } catch (error) {
            console.error(error);
            this.respostaErro(res);
        }
    }

    async buscarChamadoPorNumero(dados, res) {
        try {
            const numero = dados.queryResult.parameters.numero;

            if (!numero) {
                return res.status(200).json({
                    fulfillmentMessages: [{
                        text: { text: ["Por favor, informe o número do protocolo/chamado para que eu possa localizar."] }
                    }]
                });
            }

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
                this.respostaErro(res, `Chamado número ${numero} não encontrado.`);
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

    formatarPrazoEmHoras(minutos) {
        if (minutos >= 60) {
            const horas = Math.floor(minutos / 60);
            const minutosRestantes = minutos % 60;

            if (minutosRestantes > 0) {
                return `${horas} horas e ${minutosRestantes} minutos`;
            } else {
                return `${horas} horas`;
            }
        } else {
            return `${minutos} minutos`;
        }
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
