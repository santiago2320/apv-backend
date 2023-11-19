import jwt from 'jsonwebtoken'
import Veterinario from '../models/Veterinario.js';

const checkAut = async (req, res, next)=>{

    let token;
    
    // Revisar que el token este en el Header.
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        
        try {
            token = req.headers.authorization.split(" ")[1]

            // Se comprueba la autencidad el token
            const decoded = jwt.verify(token, process.env.JWT_SCRET);

            // Buscamos por el usuario por ID - eliminamos los campos que no son necesarios
            req.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado");

            return next();
        } catch (error) {
           // No hubo token
            const e = new Error('Token no valido ')
            return res.status(403).json({msg: e.message});
        }
    }

    if(!token){
        const error = new Error('Token no valido o inexistente')
        res.status(403).json({msg: error.message});
    }
    next();
};

export default checkAut;