import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false, 
    auth: 

})


export default transporter;