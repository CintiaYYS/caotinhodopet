import Produto from "../Model/Produto.js";

export function criarMessengerCard(){
    return {
        type:"info",
        title:"",
        subtitle:"",
        image: {
            src : {
                rawUrl:""
            }
        },
        actionLink:""
    }
}

export function criarCustomCard(){
    return {
        card: {
            title:"",
            subtitle:"",
            imageUri:"",            
        }
    }
    
}

export async function obterCardsProdutos(tipoCard="DIALOGFLOW_CONSOLE"){

    const listaCardsProdutos = [];
    const produto = new Produto();
    const produtos = await produto.selecionar('');

    for (const produto of produtos){

        let card;
        if (tipoCard=="DIALOGFLOW_CONSOLE"){
            card = criarCustomCard();
            card.card.title = produto.nome;
            card.card.subtitle = `Descrição: ${produto.descricao} \n
                                  Valor: ${produto.valor} \n                                  
                                 `;
            card.card.imageUri = produto.urlImagem;
        }
        else{
            card = criarMessengerCard();
            card.title = produto.nome;
            card.subtitle = `Descrição: ${produto.descricao} \n
                             Valor: ${produto.valor} \n                             
                            `;
            card.image.src.rawUrl = produto.urlImagem;
        }

        listaCardsProdutos.push(card);
    }

    return listaCardsProdutos;

}