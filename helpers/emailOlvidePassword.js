// Funcinalidad para el registro.
import nodemailer from 'nodemailer';

const emailOlvidePassword = async (datos) => {

   const transporter = nodemailer.createTransport({
       host: process.env.EMAIL_HOST,
       port:process.env.EMAIL_PORT ,
       auth: {
         user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_PASS
       }
     });

     const {email,nombre,token} = datos;

     // ENVIAR EL EMAIL.
     const info = await transporter.sendMail({
       // Contenido del Email.
       form: 'APV - Administrador de pacientes de Veterinaria',
       to: email,
       subject: 'Reestablece tu Password',
       text: 'Reestablece tu Password',
       html: `<p>Hola: ${nombre}, has solicitado reestablece tu password</p>

               <p>Sigue el siguiente enlace para generar un nuevo password 
               <a href= "${process.env.FRONTEND_URL}/olvide-password/${token}">Reestableces Password</a>
               </p>
               
               <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje. </p>
       `,
     });

     console.log('Mensaje Enviado: %S', info.messageId);

}

export default emailOlvidePassword