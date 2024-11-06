import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const host = "localhost";
const porta = "3000";

app.listen(porta,host,()=>{
    console.log(`Servidor escutando em http://${host}:${porta}`);
});