import { Router } from "express";
import ProdutoCtrl from "../Controller/ProdutoCtrl.js";

const prodCtrl = new ProdutoCtrl();
const rotaProduto = new Router();

rotaProduto
.get("/", prodCtrl.consultar)
.get("/:produto", prodCtrl.consultar)
.post("/", prodCtrl.gravar)
.put("/",prodCtrl.alterar)
.patch("/",prodCtrl.alterar)
.delete("/:id",prodCtrl.excluir);


export default rotaProduto;