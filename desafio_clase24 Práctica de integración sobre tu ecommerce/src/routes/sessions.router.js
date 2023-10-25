import { Router } from "express";
import passport from 'passport';
import userModel  from "../models/user.model.js"
import bcrypt from "bcryptjs";
import { isAuthorizedAdmin, isLogged } from "../public/authenticationMidd.js";

const router = Router()

// CODIGO PARA TODO LO QUE TENGA QUE VER CON REGISTRO, lOGEO, Y LOGOUT

// TODOS LOS GET

// Ruta para registrarse
router.get('/register', (req, res) => {
    if (req.session.user) return res.redirect('/profile')
    res.render('register')
})

// Ruta para el inicio de sesión
router.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/products')
    res.render('login')
})

// Ruta para toda la informacion del usuario atuenticado
router.get('/profile', isLogged, (req, res) => {

    const userData = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
    }
    console.log(userData)
    res.render('profile', userData)
    
})

// Ruta para cerrar la sesión
router.get('/logout', isLogged, (req, res) => {
    req.session.destroy((err) => {
        if (err) return console.log(err.message)
        res.redirect('/api/sessions/login')
    })
    
})

// Ruta para Git Hub

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {

})

// Ruta Git Hub Callback

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async (req, res) =>{
    // Guarda la información del usuario autenticado en la sesión
    req.session.user = req.user
    // Redirige al usuario a la página de productos
    res.redirect('/products')
})

//Ruta de registro fallido

router.get('/failRegister', (req, res) => {
    res.send({ error: 'Failed to register' })
})

//Ruta Current
router.get('/current', (req, res) => {
    if (!req.session.user) return res.status(401).json({ status: 'error', error: 'No session detected!'})
    res.status(200).json({status: 'success', payload: req.session.user})
})



// TODOS LOS POST
router.post('/login', passport.authenticate('login', { failureRedirect: '/sessions/failRegister'  }), async (req, res) => {
    try {
        req.session.user = req.user;
        return res.status(200).json({status: 'success', message: 'Sesión iniciada correctamente'})

    } catch (err) {
        console.log("Error en el inicio de sesión", err);
        return res.status(500).json({ error: 'Error en el servidor.' });
    }
})


router.post('/register',passport.authenticate("register", {
    failureRedirect: "/sessions/failRegister",
    }), async (req, res) => {
    try {
        // El registro fue exitoso, y el usuario se encuentra en req.user
        const user = req.user;

        // Puedes acceder a la información del usuario desde 'user' y la información adicional que quieras agregar
        const first_name = user.first_name;
        const last_name = user.last_name;
        
        return res.status(201).json({ status: 'success', message: `${first_name} ${last_name}, se a registrado correctamente`, user: user })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
})


export default router





// PARA VALIDAR CIERTOS VALORES EN EL LOGIN - VER O BORRAR

// // Verificar la existencia de campos obligatorios
// if (!email || !password) {
//     return res.status(400).json({ status: 'error', message: 'Debes proporcionar correo electrónico y contraseña' });
// }

// // Validar el formato del correo electrónico
// const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// if (!emailPattern.test(email)) {
//     return res.status(400).json({ status: 'error', message: 'El correo electrónico no es válido' });
// }