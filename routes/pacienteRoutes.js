import express from "express";
const router = express.Router();
import { agregarPaciente,obtenerPacientes,obtenerPaciente,actualizarPaciente,eliminarPaciente } from "../controllers/pacienteController.js";
import checkAut from "../middleware/authMiddleware.js";

//checkAut -> indica que el usuario debe estar autenticado
router.route('/').post(checkAut,agregarPaciente).get(checkAut,obtenerPacientes)

//Obtener un paciente en especifico
router.route('/:id').get(checkAut, obtenerPaciente).put(checkAut,actualizarPaciente).delete(checkAut, eliminarPaciente);


export default router;