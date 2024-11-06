import AgendamentoDAO from "../DB/AgendamentoDAO.js";

export default class Agendamento{
    #id;
    #dataInicio;
    #dataFinal;
    #usuario;
    #produto;

    //O agendamento é feito de forma diferente para cada produto ou serviço oferecido
    //Para venda de ração, a data do agendamento é da data de entrega da ração, assim a data de 
    //início e final devem ser a mesma
    //Para hospedagem, a data do agendamento é a data de chegada do pet é a data início
    //e a data final é a saída do pet
    constructor(id,dataInicio,dataFinal,usuario={"cpf":""},produto){
        this.#id = id;
        this.#dataInicio = dataInicio;
        this.#dataFinal = dataFinal;
        this.#usuario = usuario;
        this.#produto = produto;
    }

    get id(){
        return this.#id;
    }

    set id(novoid){
        this.#id = novoid;
    }

    get dataInicio(){
        return this.#dataInicio;
    }

    set dataInicio(novodataInicio){
        this.#dataInicio = novodataInicio;
    }

    get dataFinal(){
        return this.#dataFinal;
    }

    set dataFinal(novodataFinal){
        this.#dataFinal = novodataFinal;
    }

    get usuario(){
        return this.#usuario;
    }

    set usuario(novousuario){
        this.#usuario = novousuario;
    }

    get produto(){
        return this.#produto;
    }

    set produto(novoproduto){
        this.#produto = novoproduto;
    }

    toJSON(){
        return {
            id:this.#id,
            dataInicio:this.#dataInicio,
            dataFInal:this.#dataFinal,
            usuario:this.#usuario,
            produtos:this.#produto                    
        }
    }

    async gravar(){
        const agendDAO = new AgendamentoDAO();
        await agendDAO.gravar(this);
    }
}