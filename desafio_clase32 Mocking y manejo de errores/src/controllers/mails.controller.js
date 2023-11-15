import nodemailer from 'nodemailer'
import { NODEMAILER_PASS, NODEMAILER_USER } from '../utils.js'

export const getbillController = async (req, res) => {
    
    try {
        let config = {
            service: 'gmail',
            auth: {
                user: NODEMAILER_USER,
                pass: NODEMAILER_PASS
            }
        }
    
        console.log(config)
        let transporter = nodemailer.createTransport(config)
    
        console.log(transporter)
    
        let message = {
            from: NODEMAILER_USER,
            to: 'jaf973@hotmail.com',
            subject: 'Probando mail',
            html: 'Vas a terminar el proyecto'
        }
    
        console.log(message)
    
        transporter.sendMail(message)
            .then(() => res.status(201).json({ status: 'success' }))
            .catch(err => res.status(500).json({ err }));
    } catch (err) {
        console.log(err)
    }
}