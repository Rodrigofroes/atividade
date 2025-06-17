import ChamadoDAO from "../DAO/chamadoDAO.js";


export function criarMessengerCard() {
    return {
        type: "info",
        title: "",
        subtitle: "",
        image: {
            src: {
                rawUrl: ""
            }
        },
        actionLink: ""
    }
}

export function criarCustomCard() {

    return {
        card: {
            title: "",
            subtitle: "",
            imageUri: "",
            buttons: [
                {
                    text: "botão",
                    postback: ""
                }
            ]
        }
    }

}


export async function obterCardChamados(tipoCard = "custom") {
    const listaCardsChamados = [];
    const chamadoDAO = new ChamadoDAO();
    const listaChamados = await chamadoDAO.buscarTodos();

    for (const chamado of listaChamados) {
        let cartao;

        if (tipoCard == "custom") {
            cartao = criarCustomCard();
            cartao.card.title = chamado.nome;
            cartao.card.subtitle = chamado.descricao;
        } else {
            cartao = criarMessengerCard();
            cartao.title = chamado.nome;
            cartao.subtitle = chamado.descricao;
        }
        listaCardsChamados.push(cartao);
    }
    return listaCardsChamados;
}