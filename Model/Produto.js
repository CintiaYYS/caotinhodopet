import ProdutoDAO from "../DB/ProdutoDAO.js"

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

    async gravar(){
        const produtoDAO = new ProdutoDAO();
        await produtoDAO.gravar(this);
    }
    async alterar(){
        const produtoDAO = new ProdutoDAO();
        await produtoDAO.alterar(this);
    }

    async excluir(){
        const produtoDAO = new ProdutoDAO();
        await produtoDAO.excluir(this);
    }

    async consultar(termoBusca){
        const produtoDAO = new ProdutoDAO();
        return await produtoDAO.consultar(termoBusca);
    }

    async selecionar(termoBusca){
        const produtoDAO = new ProdutoDAO();
        return await produtoDAO.selecionar(termoBusca);
    }

}