import jwt from 'jsonwebtoken'

const generarJWT = (id) => {
    return jwt.sign({id}, process.env.JWT_SCRET, {
        expiresIn: "30d",
    })
}

export default generarJWT;