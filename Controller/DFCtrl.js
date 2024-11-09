import { obterCardsProdutos } from "../DialogFlow/funcoes.js";
import Agendamento from "../Model/Agendamento.js";
import Pet from "../Model/Pet.js";
import Produto from "../Model/Produto.js";
import Usuario from "../Model/Usuario.js";

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
                case 'selecaoProduto':
                    resposta = await processarEscolha(dados, origem);
                    break;
                case 'coletaInformacoes':
                    resposta = await cadastraUsu(dados, origem);
                    break;
                case 'coletaInformacoesPet':
                    resposta = await cadastraPet(dados,origem);
                    break;
                case 'coletaInformacoes-yes':
                    resposta = await agendar(dados,origem);
                    break;
                case 'informacoesAgendamento':
                    resposta = await consultaAgendamento(dados,origem);
                    break;
                case 'horarioAtendimento':
                    resposta = await informaHorario(origem);
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

    try {
        let cards = await obterCardsProdutos(tipo);

        if (tipo == 'DIALOGFLOW_CONSOLE') {
            resposta['fulfillmentMessages'].push({
                "text": {
                    "text": ["Seja bem-vindo ao centro de atendimento do Cãotinho do Pet.\n ",
                        "Estamos disponíveis 24h por dia e 7 dias na semana.\n  ",
                        "Estamos preparados para te ajudar com os seguintes serviços e produtos:\n  "
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
            //adicionando os cards de produtos
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
        if (tipo == 'DIALOGFLOW_CONSOLE') {
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
        const resultado = await produto.selecionar(prod);
        if (resultado.length > 0) {
            listaMensagens.push(`Entendi, você precisa de ${prod} para seu pet. \n`);
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
    
    let listaDeProdutos = [];
    const produtosSelecionados = global.dados[sessao]['produtos'];
    const produtoM = new Produto();
    for (const prod of produtosSelecionados) {
        const busca = await produtoM.selecionar(prod);
        if (busca.length > 0) {
            listaDeProdutos.push(busca[0]); 
        }
    }

    const usu = global.dados[sessao]['usuario']
    const usuario = new Usuario(usu.cpf,usu.nome,usu.telefone,usu.endereco);
    const agendamento = new Agendamento(0, '','', usuario, listaDeProdutos);
    await agendamento.gravar();

    let resposta = {
        "fulfillmentMessages": []
    };

    if (origem) {
        resposta['fulfillmentMessages'].push({
            "text": {
                "text": [`Agendamento nº ${agendamento.id} registrado com sucesso. \n`,
                    "Anote o número para consulta ou acompanhamento posterior.\n",                                        
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
//Funcao utilizada para gerar um CPF aleatporio, nem sempre válido
function geraCPF() {
    let resultado = '';

    for (let i = 0; i < 14; i++) {
        if (i === 3 || i === 7) {
            resultado += '.'; // Adiciona ponto na posição 3 e 7
        } else if (i === 11) {
            resultado += '-'; // Adiciona hífen na posição 11
        } else {
            resultado += Math.floor(Math.random() * 10); // Adiciona número aleatório
        }
    }
    return resultado;
}

async function cadastraUsu(dados, origem) {
    const sessao = dados.session.split('/').pop();
    
    const nome = dados.queryResult.parameters.person[0].name;
    const telefone = dados.queryResult.parameters["phone-number"][0];
    const endereco = Object.values(dados.queryResult.parameters.location[0]).filter(value => value !== "").join(", ");
    const cpf = geraCPF();

    const usuario = new Usuario(cpf,nome,telefone,endereco);

    await usuario.gravar();

    if (!global.dados) {
        global.dados = {};
    }
    
    if (!global.dados[sessao].usuario) {
        global.dados[sessao].usuario = {
                cpf:usuario.cpf,
                nome:usuario.nome,
                telefone:usuario.telefone,
                endereco:usuario.endereco
            }
    }    

    let resposta = {
        "fulfillmentMessages": []
    };

    if (origem) {
        resposta['fulfillmentMessages'].push({
            "text": {
                "text": [`${usuario.nome} suas informações foram registradas com sucesso. \n`,                    
                    "Posso confirmar o agendamento?\n"
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
                    "text": [`${usuario.nome} suas informações foram registradas com sucesso. \n`,                    
                    "Posso confirmar o agendamento?\n"
                    ]
                }]]
            }
        });
    }
    return resposta;

}

async function cadastraPet(dados, origem) {    
    const nome = dados.queryResult.parameters.person[0].name;
    
    const pet = new Pet(0,nome);

    await pet.gravar();

    let resposta = {
        "fulfillmentMessages": []
    };

    if (origem) {
        resposta['fulfillmentMessages'].push({
            "text": {
                "text": ["Pet registrado com sucesso. \n",
                    "Agora preciso de algumas informações suas.\n",
                    "Por favor, qual seu nome, endereço e telefone?\n"
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
                    "text": ["Pet registrado com sucesso. \n",
                    "Agora preciso de algumas informações suas.\n",
                    "Por favor, qual seu nome, endereço e telefone?\n"
                    ]
                }]]
            }
        });
    }
    return resposta;

}

async function consultaAgendamento(dados,origem) {
    const numero = dados.queryResult.parameters.number;
    const agendamento = new Agendamento()
    const agendProcurado = await agendamento.consultar(numero);
    let listaMensagens = [];

    if (agendProcurado){
            const produ = new Produto();            
            const prod = await produ.consultar(agendProcurado.produto);
            listaMensagens.push(`Agendamento nº ${agendProcurado.id}:\n`);
            listaMensagens.push(`${prod.nome} \n`);
            listaMensagens.push(`Para o dia ${agendProcurado.dataFinal}`);                                 
    }

    let resposta = {
        "fulfillmentMessages": []
    };
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

async function informaHorario(origem) {
    let resposta = {
        "fulfillmentMessages": []
    };
    if (origem) {
        resposta['fulfillmentMessages'].push({
            "text": {
                "text": [
                    "Entregamos RAÇÃO de Segunda a Sexta, das 7h às 19h.\n",
                    "Para HOSPEDAGEM, o chek-in e check-out devem ser feitos entre 7h e 23h, de Segunda a Segunda, inclusive feriados.📅\n"
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
                    "text": [
                        "Entregamos RAÇÃO de Segunda a Sexta, das 7h às 19h. 📅\n",
                        "Para HOSPEDAGEM, o chek-in e check-out devem ser feitos entre 7h e 23h, de Segunda a Segunda, inclusive feriados.\n"                    ]
                }]]
            }
        });
    }

    return resposta;
}