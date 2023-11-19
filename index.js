import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import conectarDB from "./config/db.js";
import veterinarioRoutes from './routes/veterinarioRoutes.js'
import pacienteRoutes from './routes/pacienteRoutes.js'

const app = express();
app.use(express.json());
dotenv.config();

conectarDB();

// CORS - Definimos los dominios permitidos
const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin,callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){
            // El origen del reques esta permitido - callback es el error
            callback(null,true)
        }else{
            callback(new Error('No permitido por CORS'))
        }
    }
}

app.use(cors(corsOptions));

console.log(process.env.MONGO_URI);

// Express manejar el routing - Veterinarios
app.use('/api/veterinarios', veterinarioRoutes);
// Router de pacientes
app.use('/api/pacientes', pacienteRoutes);

// Creamos la variable para el puerto para cuando se realice el deployment. si no existe port en arhcivo .env. ejecute el puerto 4000
const PORT = process.env.PORT || 4000

// Crear el servidor
app.listen(PORT, ()=>{
    console.log(`Servidor funciona en el puerto ${PORT}`);
})

