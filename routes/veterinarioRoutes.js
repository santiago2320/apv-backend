import express from 'express'
const router = express.Router();
import {registrar,perfil,confirmar,autenticar,olvidePassword,comprobarToken,nuevoPassword,actualizarPerfil,updatePassword} from '../controllers/veterinarioController.js'
import checkAut from '../middleware/authMiddleware.js';

//Rutas relacionadas con veterinarios - req lo que enviamos al servidor - res es la respuesta del servidor
/**Rutas para el area publica */

// Post es cuando enviamos datos al servidor
router.post('/',registrar);
// Confirmar cuenta via token
router.get('/confirmar/:token',confirmar);
// Autenticar Usuario
router.post('/login', autenticar)
// Resetear el Password.
router.post('/olvide-password', olvidePassword);
// Definimos la Url con route - Comprobar el token y enviar nuevoPassword
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)

// Login - protegiendo cuenta debe tener el usuario validado
router.get('/perfil', checkAut, perfil);
// Actualizar un registro
router.put('/perfil/:id', checkAut, actualizarPerfil)
// Actualizar password de perfil
router.put('/cambiar-password',checkAut,updatePassword)






export default router;