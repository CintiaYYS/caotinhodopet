export default class Produto{
    #id
    #nome
    #descricao
    #valor
    #urlImagem

    constructor(id=0,nome,descricao,valor=0,urlImagem){
        this.#id = id;
        this.#nome = nome;
        this.#descricao = descricao;
        this.#valor = valor;
        this.#urlImagem = urlImagem;
    }

    get id(){
        return this.#id;
    }

    set id(novoId){
        this.#id = novoId;
    }

    get nome(){
        return this.#nome;
    }

    set nome(novoNome){
        this.#nome = novoNome;
    }

    get descricao(){
        return this.#descricao;
    }

    set descricao(novoDescricao){
        this.#descricao = novoDescricao;
    }

    get valor(){
        return this.#valor;
    }

    set valor(novoValor){
        this.#valor = novoValor;
    }

    get urlImagem(){
        return this.#urlImagem;
    }

    set urlImagem(novoUrlImagem){
        this.#urlImagem = novoUrlImagem;
    }

    toJSON(){
        return {
            id:this.#id,
            nome:this.#nome,
            descricao:this.#descricao,
            valor:this.#valor,
            urlImagem:this.#urlImagem
        }   
    }
}