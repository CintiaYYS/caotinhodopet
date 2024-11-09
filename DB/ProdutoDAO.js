import Produto from '../Model/Produto.js'
import conectar from './Conexao.js';

export default class ProdutoDAO {

    constructor(){
        this.init();
    }

    async init() {
        try {
            
            const sql = ` CREATE TABLE IF NOT EXISTS produto(
            id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            nome VARCHAR(100) NOT NULL,
            descricao VARCHAR(200) NOT NULL,
            valor DECIMAL(6,2) NOT NULL,
            urlImagem VARCHAR(250) NOT NULL            
        )
        `
            const conexao = await conectar();
            await conexao.execute(sql);
            console.log("Tabela Produto iniciada com sucesso!");
        }catch(erro){
            console.log("Não foi possível iniciar a tabela Produto: " + erro.message);
        }

    }

    async gravar(produto) {
        if (produto instanceof Produto) {
            const sql = `INSERT INTO produto(nome,descricao,
                                             valor,urlImagem)
                        VALUES (?,?,?,?)`;
            const parametros = [produto.nome,
                produto.descricao,
                produto.valor,
                produto.urlImagem];
            const conexao = await conectar();
            const resultado = await conexao.execute(sql, parametros);
            produto.id = resultado[0].insertId;
        }
    }

    async alterar(produto) {
        if (produto instanceof Produto) {
            const sql = `UPDATE produto SET  nome = ? , descricao = ?,
                        valor = ?, urlImagem = ?
                        WHERE id = ?`;
            const parametros = [produto.nome,
                produto.descricao,
                produto.valor,
                produto.urlImagem,
                produto.id];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
        }
    }

    async excluir(produto) {
        if (produto instanceof Produto) {
            const sql = `DELETE FROM produto  WHERE id = ?`;
            const parametros = [produto.id];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
        }
    }
    //Consulta o produto usando o id
    //o termo de busca precisa ser um número
    async consultar(termoBusca) {        
        console.log("Buscando produto de id: ", termoBusca);
        const sql = "SELECT * FROM produto WHERE id = ?";        
        const conexao = await conectar();
        const [registros, campos] = await conexao.query(sql,termoBusca);        
        const registro = registros[0];
        const produto = new Produto(registro['id'],
                                    registro['nome'],
                                    registro['descricao'],
                                    registro['valor'],
                                    registro['urlImagem']
                                );    
        return produto;
    }

    //Seleciona os produtos que tem um termo na descrição ou seleciona todos os produtos 
    async selecionar(termoBusca){
        if(!termoBusca){
            termoBusca='';
        }
        const sql = `SELECT * FROM produto WHERE descricao LIKE ? order by nome`;
        const parametros = ["%"+termoBusca+"%"]
        const conexao = await conectar();
        const [registros, campos] = await conexao.query(sql,parametros);
        let listaProdutos=[];
        for (const registro of registros){
            const produto = new Produto(registro['id'], registro['nome'], registro['descricao'],registro['valor'], registro['urlImagem']);
            listaProdutos.push(produto);
        }
        return listaProdutos;
    }

}