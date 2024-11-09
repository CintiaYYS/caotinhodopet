import Agendamento from "../Model/Agendamento.js";
import conectar from "./Conexao.js"

export default class AgendamentoDAO{

    async init() {
        try {
            const conexao = await conectar();
            const sql = `
                CREATE TABLE IF NOT EXISTS agendamento(
                    numero int not null primary key auto_increment,
                    dataInicio varchar(10) not null,
                    dataFinal varchar(10) not null,
                    fk_usu_cpf varchar(14) not null,
                    fk_prod int not null,
                    constraint fk_usuario foreign key fk_usu_cpf references usuario(pk_usu_cpf),
                    constraint fk_produto foreign key fk_prod references produto(id)
                )
            `;
            conexao.release();

        }
        catch (erro) {

        }
    }

    async gravar(agendamento) {
        if (agendamento instanceof Agendamento) {
            try {
                const conexao = await conectar();
                conexao.beginTransaction();

                const sqlAgendamento = "INSERT INTO agendamento(dataInicio,dataFinal,fk_usu_cpf,fk_prod) VALUES(?,?,?,?)";
                const dataInicio = new Date();
                const dataFinal = new Date();
                const dias = Math.floor(Math.random() * (max - min + 1)) + min;
                dataInicio.setDate(dataInicio.getDate() + dias);
                dias = Math.floor(Math.random() * (max - min + 1)) + min;
                dataFinal.setDate(dataInicio.getDate() + dias);
                let parametros = [dataInicio.toLocaleDateString(),dataFinal.toLocaleDateString(), agendamento.usuario.cpf,agendamento.produto[0].id];
                const resultado = await conexao.execute(sqlAgendamento, parametros);    
                agendamento.id = resultado[0].insertId;
                conexao.commit();
                conexao.release();
            }
            catch (erro) {
                if (conexao){
                    conexao.rollback();
                }
            }
            
        }

    }

    //Busca o agendamento usando o número do agendamento
    async consultar(termoBusca) {
        if (!termoBusca){
            termoBusca='';
        }
        const sql = "SELECT * FROM agendamento WHERE numero = ?";        
        const conexao = await conectar();
        const [registros, campos] = await conexao.query(sql,termoBusca);    
        const registro = registros[0];
        const agendamento = new Agendamento(registro['numero'],                                    
                                    registro['dataInicio'],
                                    registro['dataFinal'],
                                    registro['fk_usu_cpf'],
                                    registro['fk_prod']
                                );
                
        return agendamento;
    }
/*
    async consultar(termoBusca){
        if(!termoBusca){
            termoBusca='';
        }
        const sql = `SELECT * FROM agendamento WHERE numero = ?`;
        const parametros = [termoBusca]
        const conexao = await conectar();
        const [registro, campos] = await conexao.query(sql,parametros);        
        const agendamento = new Agendamento(registro['id'], registro['dataInicio'], registro['dataFinal'],registro['fk_usu_cpf'], registro['fk_prod']);            
        return agendamento;
    }
*/
}