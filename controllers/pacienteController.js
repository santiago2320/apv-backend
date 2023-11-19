// Importamos el modelo de paciente

import Paciente from "../models/Paciente.js";
import mongoose from "mongoose";

const agregarPaciente = async (req,res) => {
    console.log(req.body);
    // Creamos una instancia del objeto de paciente - genere el objeto de pacientes
    const paciente = new Paciente(req.body)
    paciente.veterinario = req.veterinario._id
    
    try {
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (error) {
        console.log(error);
    }
}
// Obtiene todo los pacientes.
const obtenerPacientes = async(req,res) => {
    // Los pacientes que queremos traer x veterinario
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);
    res.json(pacientes);
}

// Obtener un paciente en especifico
const obtenerPaciente = async (req,res) => {
   const {id} = req.params
   // Traemos la informacion del paciente x id
   const paciente = await Paciente.findById(id)
   // Validamos si no hay paciente
   if(!paciente){
        return res.status(404).json({msg: "No encontrado"})
    }
 
   // Validar si el paciente fue creado por el mismo veterinario
   // Los object_id se deben convertir a string para que sea true, ya que en memoria se guarda diferente.
   if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: "Accion no valida"})
   }

   // Mostramos la informacion de paciente.
   res.json(paciente)

}

const actualizarPaciente = async (req,res) => {
    const {id} = req.params
    // Traemos la informacion del paciente x id
    const paciente = await Paciente.findById(id)

    // Validamos si no hay paciente
    if(!paciente){
        return res.status(404).json({msg: "No encontrado"})
    }
  
    // Validar si el paciente fue creado por el mismo veterinario
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
         return res.json({msg: "Accion no valida"})
    }
    // Actualizar paciente -
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;
    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado)
    } catch (error) {
        console.log(error);
    }
}

const eliminarPaciente = async (req,res) => {
    const {id} = req.params
    
    // Validamos que el id debe tener 24 caractares.
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        const error = new Error('Id no válido, Contacte con Soporte');
        return res.status(403).json({ msg: error.message });
    }

    // Traemos la informacion del paciente x id
    const paciente = await Paciente.findById(id)
    // Validamos si no hay paciente
    if(!paciente){
        return res.status(404).json({msg: "No encontrado"})
    }
  
    // Validar si el paciente fue creado por el mismo veterinario
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
         return res.json({msg: "Accion no valida"})
    }
    //Eliminamos el paciente
    try {
        await paciente.deleteOne()
        res.json({msg: 'Paciente Eliminado'});
    } catch (error) {
        console.log(error);
    }
}

export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}