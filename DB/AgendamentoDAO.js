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
                
                const sqlChamado = "INSERT INTO agendamento(dataInicio,dataFinal,fk_usu_cpf,fk_prod) VALUES(?,?,?,?)";
                const data = new Date();
                let parametros = [data.toLocaleDateString(),data.toLocaleDateString(), agendamento.usuario.cpf,agendamento.produto];
                conexao.execute(sqlChamado, parametros);                
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

}