import express from 'express';
import dotenv from 'dotenv';
import rotaProduto from './Routes/rotaProduto.js';
import rotaDF from './Routes/rotaDF.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/produto",rotaProduto);
app.use("/webhook", rotaDF)
app.use(express.static('./publico'));

const host = "localhost";
const porta = "3000";

app.listen(porta,host,()=>{
    console.log(`Servidor escutando em http://${host}:${porta}`);
});