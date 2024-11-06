import { Router } from "express";
import ProdutoCtrl from "../Controller/ProdutoCtrl.js";

const prodCtrl = new ProdutoCtrl();
const rotaServico = new Router();

rotaProduto
.get("/", prodCtrl.consultar)
.get("/:servico", prodCtrl.consultar)
.post("/", prodCtrl.gravar)
.put("/",prodCtrl.alterar)
.patch("/",prodCtrl.alterar)
.delete("/:id",prodCtrl.excluir);


export default rotaProduto;