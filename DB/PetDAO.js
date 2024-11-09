import conectar from "./Conexao.js";
import Pet from "../Model/Pet.js";

export default class PetDAO{

    async init() {
        try {
            const conexao = await conectar();
            const sql = `
                CREATE TABLE IF NOT EXISTS pet(
                    id_pet int not null primary key auto_increment,
                    nome varchar(50) not null
                )
            `;
            conexao.release();
        }
        catch (erro) {

        }
    }

    async gravar(pet) {
        if (pet instanceof Pet) {
            try {
                const conexao = await conectar();
                conexao.beginTransaction();

                const sqlPet = "INSERT INTO pet(id_pet, nome) VALUES(?,?)";                
                let parametros = [ pet.id_pet,pet.nome];
                const resultado = await conexao.execute(sqlPet, parametros);                
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

    async consultar(termoBusca) {
        if (!termoBusca){
            termoBusca='';
        }
        const sql = "SELECT * FROM pet WHERE id_pet = ?";        
        const conexao = await conectar();
        const [registro, campos] = await conexao.query(sql,termoBusca);        
        const pet = new Pet(registro['id_pet'],
                            registro['nome']
                            );
                
        return pet;
    }

}