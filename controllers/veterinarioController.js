import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";


const registrar = async (req,res)=>{
    //leer los datos de Postaman - aplicamos destructuring
    const {email, nombre} = req.body

    // Prevenir usuarios duplicados.
    const existeUsuario = await Veterinario.findOne({email})

    if(existeUsuario){
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message});
    }

    try {
        // Guardar un nuevo veterinario - creamos una instancia del modelo - leer los datos  de postman(req.body)
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        // Enviar el email.
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token,
        })

        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error,"error al guardar el dato");
    }
};

// router perfil
const perfil = (req,res)=>{

    const {veterinario} = req

    res.json(veterinario);
}

// router de confirmar cuenta
const confirmar = async(req,res) => {
    const {token} = req.params

    // Buscamos por token en el modelo
    const userConfirmar = await Veterinario.findOne({token})

    // SI el usuario o el token no existe: mostrramos token no valido
    if(!userConfirmar){
        const error = new Error('Token no valido');
        return res.status(404).json({msg: error.message});
    }

    // modificamos los valores del objetos del usuario - mostrar el token vacio- y confirmando la cuenta
    try {
        userConfirmar.token = null;
        userConfirmar.confirmado = true;
        // Guardamos el usuario
        await userConfirmar.save();
        // Mensaje al usuario
        res.json({msg: "Usuario confirmado correctamente"});  
        
    } catch (error) {
        console.log(error);
    }    
}

// Login
const autenticar = async(req,res)=> {
    const {email,password} = req.body

    // Comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email});
    if(!usuario){
        const error = new Error("El Usuario no existe");
        return res.status(404).json({msg: error.message})
    }

    // Comprobar si el usuario esta confirmado.
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no esta confirmada');
        return res.status(404).json({msg: error.message});
    }

    // Revisar el password
    if( await usuario.comprobarPassword(password)){
        console.log(usuario);
        // Autenticar el usuario - los datoss que retonamos
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        });
    } else {
        const error = new Error("El password es incorrecto");
        return res.status(404).json({msg: error.message})
    }
    
};

// Metodo de Olvide-Password
const olvidePassword = async (req,res) =>{
    // Destructuring al email
    const {email} = req.body;
    
    // Comprobar si existe el usuario
    const existeVeterinario = await Veterinario.findOne({email});

    // Si no existe el usuario
    if(!existeVeterinario){
        const error = new Error('El usuario no existe');
        return res.status(400).json({msg: error.message})
    }

    // si existe el usuario (correo) - generamos un token y un msg
    try {
        existeVeterinario.token = generarId()
        await existeVeterinario.save();

        // Enviar Email con instrucciones - archivo emailOlvidePassword.
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        res.json({msg: "Hemos enviado un email con las instrucciones"});
    } catch (error) {
        console.log(error);
    }

}

// Metodo de enviar el token
const comprobarToken = async(req,res) =>{
    // acceder a la informacion mediante req-params (URL)
    const {token} = req.params

    // Buscar que usuario tiene ese token
    const tokenValido = await Veterinario.findOne({token});

    if(tokenValido){
        // El token es valido el usuario existe
        res.json({msg:'Token valido y usuario existe'});
    }else{
        const error = new Error('Token no valido')
        return res.status(400).json({msg: error.message});
    }
}

// Metodo de nuevo password
const nuevoPassword = async(req,res) =>{
    const {token} = req.params
    const {password} = req.body

    // Buscamos por el token
    const veterinario = await Veterinario.findOne({token})

    if(!veterinario){
        const error = new Error('Token no valido')
        return res.status(400).json({msg: error.message});
    }

    try {
        //Eliminamos el token
        veterinario.token = null
        veterinario.password = password
        await veterinario.save()
        res.json({msg: 'Password modificado correctamente'})
    } catch (error) {
        console.log(error);
    }
};

// Metodo Actualizar Perfil
const actualizarPerfil = async (req, res) => {
    // Enviamos la solicitud por el id
    const veterinario = await Veterinario.findById(req.params.id);
    // Validamos que exista el veterinario
    if(!veterinario){
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }
    // Validar el correo
    const {email} = req.body;
    if(veterinario.email !== req.body.email){
        const existeEmail = await Veterinario.findOne({email})
        if(existeEmail){
            const error = new Error('Email ya existe')
            return res.status(400).json({msg: error.message})
        }
    }


    try {
        veterinario.nombre = req.body.nombre;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;
        veterinario.email = req.body.email;

        const veterinarioActualizado = await veterinario.save()
        res.json(veterinarioActualizado)
    } catch (error) {
        console.log(error);
    }
}

// ACTUALIZAR PASSWORD
const updatePassword = async (req, res) => {
    // Leer los datos
    const {id} = req.veterinario
    const {pwd_actual, pwd_nuevo} = req.body

    // Comprobar que el veterinario exista
    const veterinario = await Veterinario.findById(id);
    // Validamos que exista el veterinario
    if(!veterinario){
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }
    // Comprobar su password
    if(await veterinario.comprobarPassword(pwd_actual)){
        // Almacenar el nuevo password
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({msg: 'Password almacenado correctamente'})
    }else{
        const error = new Error('Password actual es incorrecto')
        return res.status(400).json({msg: error.message})
    }

    // Almacenar el nuevo password.
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    updatePassword
}