import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import generarId from '../helpers/generarId.js';

// Creamos el esquema
const veterinarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type:String,
        default:null,
        trim:true
    },
    web:{
       type:String,
       default:null 
    },
    token:{
        type:String,
        default: ()=> generarId(),
    },
    confirmado:{
        type:Boolean,
        default: false
    }
});

// antes de almcenarlo en la base de datos. - arrow function hace referencia a la ventana global - function hace referencia al objeto actual
veterinarioSchema.pre('save', async function(next){
    // Condicion si un password esta hasheador no lo vuela a hashear.
    if(!this.isModified("password")){
        next(); // prevenir que lo viene despues no se ejecute
    }
    // Generamos el hash con genSalt
    const salt = await bcrypt.genSalt(3)
    this.password = await bcrypt.hash(this.password,salt);
})

// Comprobar el password incriptado con el da la db.
veterinarioSchema.methods.comprobarPassword = async function (passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password);
}

const Veterinario = mongoose.model('Veterinario',veterinarioSchema);
export default Veterinario;