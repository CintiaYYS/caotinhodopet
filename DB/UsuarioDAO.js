import Usuario from '../Model/Usuario.js';
import conectar from './Conexao.js';

export default class UsuarioDAO {

    constructor(){
        this.init();
    }

    async init() {
        try {
            
            const sql = ` CREATE TABLE IF NOT EXISTS usuario(
            pk_usu_cpf INT NOT NULL PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            telefone VARCHAR(20) NOT NULL,            
            endereco VARCHAR(50) NOT NULL            
        )
        `
            const conexao = await conectar();
            await conexao.execute(sql);
            console.log("Tabela Usuario iniciada com sucesso!");
        }catch(erro){
            console.log("Não foi possível iniciar a tabela Usuario: " + erro.message);
        }

    }

    async gravar(usuario) {
        if (usuario instanceof Usuario) {
            const sql = `INSERT INTO usuario(nome,telefone, endereco)
                        VALUES (?,?,?)`;
            const parametros = [usuario.nome,
                usuario.telefone,
                produto.endereco];
            const conexao = await conectar();
            const resultado = await conexao.execute(sql, parametros);
            usuario.id = resultado[0].insertId;
        }
    }

    async consultar(termoBusca) {
        if (!termoBusca){
            termoBusca='';
        }
        const sql = "SELECT * FROM usuario WHERE pk_usu_cpf = ?";        
        const conexao = await conectar();
        const [registro, campos] = await conexao.query(sql,termoBusca);        
        const usuario = new Usuario(registro['cpf'],
                                    registro['nome'],
                                    registro['telefone'],
                                    registro['endereco']
                                );
                
        return usuario;
    }

}