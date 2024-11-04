import Produto from "../Model/Produto.js";

export default class ProdutoCtrl {
 
    gravar(requisicao, resposta) {
        if (requisicao.method == "POST" &&
            requisicao.is("application/json")) {
            const dados = requisicao.body;
            if (dados.nome && dados.descricao && dados.valor >= 0 &&
                dados.urlImagem ) {
                const produto = new Produto(0, dados.nome, dados.descricao,
                    dados.valor, dados.urlImagem);

                    produto.gravar().then(() => {
                        resposta.status(201).json({
                            "status": true,
                            "mensagem": "Produto gravado com sucesso!",
                            "id": produto.id
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao registrar o produto: " + erro.message,
                    });
                })
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe todos os dados necessários conforme documentação!"
                });
            }

        }
        else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Formato não permitido!"
            });
        }
    }


    alterar(requisicao, resposta) {
        if ((requisicao.method == "PUT" || requisicao.method == "PATCH")
            && requisicao.is("application/json")) {
            const dados = requisicao.body;
            //pseudo validação
            if (dados.id > 0 && dados.nome && dados.descricao && dados.valor >= 0 &&
                dados.urlImagem) {
                const produto = new Produto(dados.id, dados.nome, dados.descricao,
                    dados.valor, dados.urlImagem);

                    produto.alterar().then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Produto alterado com sucesso!",
                        });
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao alterar o produto: " + erro.message,
                        });
                    })
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe todos os dados necessários conforme documentação!"
                });
            }
        }
        else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Formato não permitido!"
            });
        }
    }

    excluir(requisicao, resposta) {
        if (requisicao.method == "DELETE" && requisicao.is("application/json")) {
            const id = requisicao.params.id;
            if (id > 0) {
                const produto = new Produto(id);
                produto.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Produto excluído com sucesso!",
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao excluir o produto: " + erro.message,
                    });
                })
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe o id na url!"
                });
            }
        }
        else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Formato não permitido!"
            });
        }
    }

    consultar(requisicao, resposta) {
        const termoBusca = requisicao.params.produto;
        if (requisicao.method == "GET") {
            const produto = new Produto(0);
            produto.consultar(termoBusca).then((listaProduto) => {
                resposta.status(200).json({
                    "status": true,
                    "listaProdutos": listaProduto
                });
            }).catch((erro) => {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Não foi possível recuperar os produtos: " + erro.message,
                });
            })
        }
        else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Método não permitido!"
            });
        }
    }
}