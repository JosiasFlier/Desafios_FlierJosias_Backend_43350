import { Router } from "express";
import userModel  from "../models/user.model.js"
import bcrypt from "bcryptjs";
import { isAuthorizedAdmin, isLogged } from "../public/authenticationMidd.js";

const router = Router()

// CODIGO PARA TODO LO QUE TENGA QUE VER CON REGISTRO, OGEO, Y LOGOUT

// TODOS LOS GET

router.get('/register', (req, res) => {
    if (req.session.user) return res.redirect('/profile')
    res.render('register')
})

router.get('/login', (req, res) => {
    if (req.res.user) return res.redirect('/products')
    res.render('login')
})

router.get('/profile', isLogged, (req, res) => {

    const userData = {
        first_name: req.session.user.first_name,
        last_name: req.session.user.last_name,
        email: req.session.user.email,
        age: req.session.user.age,
    }
    console.log(userData)
    res.render('profile', userData)
    
})

router.get('/logout', isLogged, (req, res) => {
    req.session.destroy((err) => {
        if (err) return console.log(err.message)
        res.redirect('/api/sessions/login')
    })
    
})




// TODOS LOS POST
router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body

        // // Verificar la existencia de campos obligatorios
        // if (!email || !password) {
        //     return res.status(400).json({ status: 'error', message: 'Debes proporcionar correo electrónico y contraseña' });
        // }

        // // Validar el formato del correo electrónico
        // const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        // if (!emailPattern.test(email)) {
        //     return res.status(400).json({ status: 'error', message: 'El correo electrónico no es válido' });
        // }

        const user = await userModel.findOne({ email })
        if (!user) return res.status(401).json({ status: 'error', message: 'Email incorrecto'})

        //para la contraseña proporcionada con la contraseña almacenada en la base de datos
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ status: 'error', message: 'Contraseña incorrecta' });

        const userSession = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role
        }

        req.session.user = userSession

        return res.status(200).json({status: 'success', message: 'Sesión iniciada correctamente'})

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
})


router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        // Verifica si el usuario ya está registrado
        const registeredUser = await userModel.findOne({ email });
        if (registeredUser) return res.status(400).json({ message: 'Correo electronico ya registrado'})

        // Verifico si las credenciales son las autorizadas para ser Admin
        const administratorEmail = isAuthorizedAdmin(email)

        const newUser = new userModel({
            first_name,
            last_name,
            email,
            age,
            password: await bcrypt.hash(password, 10),
            role: administratorEmail ? 'admin' : 'usuario'
        })


        const savedUser = await newUser.save(); //Guardo el nuevo usuario

        //Obtengo todos los datos del usuario y se guardan en la session.
        const userSession = {
            _id: savedUser.id,
            first_name: savedUser.first_name,
            last_name: savedUser.last_name,
            email: savedUser.email,
            age: savedUser.age,
            role: savedUser.role,
        }

        // Almacenar toda la información del usuario en la sesión
        req.session.user = userSession

        return res.status(201).json({ status: 'success', message: `${first_name} ${last_name}, se a registrado correctamente`, user: userSession })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
})


export default router