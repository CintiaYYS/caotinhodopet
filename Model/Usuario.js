import UsuarioDAO from "../DB/UsuarioDAO.js"

export default class Usuario{
    #cpf
    #nome
    #endereco
    #telefone
 
    constructor(id=0,nome,endereco,telefone){
        this.#cpf = cpf;
        this.#nome = nome;
        this.#endereco = endereco;
        this.#telefone = telefone;
    }

    get cpf(){
        return this.#cpf;
    }

    set cpf(novocpf){
        this.#cpf = novocpf;
    }

    get nome(){
        return this.#nome;
    }

    set nome(novonome){
        this.#nome = novonome;
    }

    get endereco(){
        return this.#endereco;
    }

    set endereco(novoendereco){
        this.#endereco = novoendereco;
    }

    get telefone(){
        return this.#telefone;
    }

    set telefone(novotelefone){
        this.#telefone = novotelefone;
    }

    toJSON(){
        return {
            id:this.#cpf,
            nome:this.#nome,
            descricao:this.#endereco,
            valor:this.#telefone
        }   
    }

    async gravar(){
        const usuarioDAO = new UsuarioDAO();
        await usuarioDAO.gravar(this);
    }

    async consultar(termoBusca){
        const usuarioDAO = new UsuarioDAO();
        return await usuarioDAO.consultar(termoBusca);
    }
}