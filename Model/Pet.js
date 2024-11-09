import PetDAO from "../DB/PetDAO.js";

export default class Pet{
    #id_pet
    #nome
 
    constructor(id_pet=0,nome){
        this.#id_pet = id_pet;
        this.#nome = nome;
    }

    get id_pet(){
        return this.#id_pet;
    }

    set id_pet(novoid_pet){
        this.#id_pet = novoid_pet;
    }

    get nome(){
        return this.#nome;
    }

    set nome(novonome){
        this.#nome = novonome;
    }


    toJSON(){
        return {
            id_pet:this.#id_pet,
            nome:this.#nome,
        }
    }

    async gravar(){
        const petDAO = new PetDAO();
        await petDAO.gravar(this);
    }

}