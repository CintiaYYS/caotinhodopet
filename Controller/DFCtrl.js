import { obterCardsProdutos } from "../DialogFlow/funcoes.js";
import Agendamento from "../Model/Agendamento.js";
import Produto from "../Model/Produto.js";

export default class DFController {

    async processarIntencoes(req, resp) {
        if (req.method == "POST" && req.is("application/json")) {
            const dados = req.body;
            const intencao = dados.queryResult.intent.displayName;
            const origem = dados?.originalDetectIntentRequest?.source;
            let resposta;
            switch (intencao) {
                case 'Default Welcome Intent':
                    resposta = await exibirMenu(origem);
                    break;
                case 'SelecaoSuporte':
                    resposta = await processarEscolha(dados, origem);
                    break;
                case 'simConcluirDemanda':
                    resposta = await agendar(dados, origem);
                    break;

            }
            resp.json(resposta);
        }

    } 

}

async function exibirMenu(tipo = '') {
    let resposta = {
        "fulfillmentMessages": []
    };

    if (tipo) {
        tipo = 'custom';
    }

    try {
        let cards = await obterCardsProdutos(tipo);

        if (tipo == 'custom') {
            resposta['fulfillmentMessages'].push({
                "text": {
                    "text": ["Seja bem-vindo ao centro de atendimento do Cãotinho do Pet.\n",
                        "Estamos disponíveis 24h por dia e 7 dias na semana.\n",
                        "Estamos preparados para te ajudar com os seguintes serviços e produtos:\n"
                    ]
                }
            });
            resposta['fulfillmentMessages'].push(...cards);
            resposta['fulfillmentMessages'].push({
                "text": {
                    "text": ["Por favor nos informe o que você deseja."]
                }
            });
            return resposta;
        }
        else {
            //formato de resposta para o ambiente messenger

            resposta.fulfillmentMessages.push({
                "payload": {
                    "richContent": [[{
                        "type": "description",
                        "title": "Seja bem-vindo ao centro de atendimento do Cãotinho do Pet.\n",
                        "text": [
                            "Estamos disponíveis 24h por dia e 7 dias na semana.\n",
                            "Estamos preparados para te ajudar com os seguintes serviços e produtos:\n"
                        ]
                    }]]
                }
            });
            //adicionando os cards de serviços
            resposta['fulfillmentMessages'][0]['payload']['richContent'][0].push(...cards);

            resposta['fulfillmentMessages'][0]['payload']['richContent'][0].push({
                "type": "description",
                "title": "Por favor nos informe o que você deseja.",
                "text": []
            });
            return resposta;
        }
    }
    catch (erro) {
        if (tipo == 'custom') {
            resposta['fulfillmentMessages'].push({
                "text": {
                    "text": ["Não foi possível recuperar a lista de serviços e produtos disponíveis.",
                        "Descupe-nos pelo transtorno!",
                        "Entre em contato conosco por telefone ☎ (18) 99641-4912."
                    ]
                }
            });
        }
        else { //formato de mensagem para messenger
            resposta.fulfillmentMessages.push({
                "payload": {
                    "richContent": [[{
                        "type": "description",
                        "title": "Não foi possível recuperar a lista de serviços e produtos disponíveis..\n",
                        "text": [
                            "Descupe-nos pelo transtorno!\n",
                            "Entre em contato conosco por telefone ☎ (18) 99641-4912."                            
                        ]
                    }]]
                }
            });
        }
        return resposta;
    }

}

async function processarEscolha(dados, origem) {

    let resposta = {
        "fulfillmentMessages": []
    };

    const sessao = dados.session.split('/').pop();
    if (!global.dados) {
        global.dados = {};
    }
    if (!global.dados[sessao]) {
        global.dados[sessao] = {
            'produtos': [],
        };
    }
    let produtosSelecionados = dados.queryResult.parameters.produto
    global.dados[sessao]['produtos'].push(...produtosSelecionados);

    let listaMensagens = [];
    for (const prod of produtosSelecionados) {
        const produto = new Produto();
        const resultado = await produto.consultar(prod);
        if (resultado.length > 0) {
            listaMensagens.push(`${prod} registrado com sucesso! \n`);
        }
        else {
            listaMensagens.push(`${prod} não está disponível!\n`);
        }
    }

    listaMensagens.push('Posso te ajudar em algo mais?\n')

    if (origem) {
        resposta['fulfillmentMessages'].push({
            "text": {
                "text": [...listaMensagens]
            }
        })
    }
    else {
        resposta.fulfillmentMessages.push({
            "payload": {
                "richContent": [[{
                    "type": "description",
                    "title": "",
                    "text": [...listaMensagens]
                }]]
            }
        });
    }

    return resposta;
}

async function agendar(dados, origem) {
    const sessao = dados.session.split('/').pop();
    const usuario = {
        "cpf": "111.111.111-11"
    }
    let listaDeProdutos = [];
    const produtosSelecionados = global.dados[sessao]['produtos'];
    const produtoM = new Produto();
    for (const prod of produtosSelecionados) {
        const busca = await produtoM.consultar(prod);
        if (busca.length > 0) {
            listaDeProdutos.push(busca[0]); 
        }
    }
    const agendamento = new Agendamento(0, '', usuario, listaDeProdutos);
    await agendamento.gravar();

    let resposta = {
        "fulfillmentMessages": []
    };

    if (origem) {
        resposta['fulfillmentMessages'].push({
            "text": {
                "text": [`Agendamento nº ${agendamento.id} registrado com sucesso. \n`,
                    "Anote o número para consulta ou acompanhamento posterior.\n"
                ]
            }
        })
    }
    else {
        resposta.fulfillmentMessages.push({
            "payload": {
                "richContent": [[{
                    "type": "description",
                    "title": "",
                    "text": [`Agendamento nº ${agendamento.id} registrado com sucesso. \n`,
                        "Anote o número para consulta ou acompanhamento posterior.\n"
                    ]
                }]]
            }
        });
    }
    return resposta;

}