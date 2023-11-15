import passport from "passport";
import localStrategy  from "passport-local";
import GithubStrategy from 'passport-github2';
import userModel  from "../models/user.model.js"
import cartModel from "../models/carts.model.js";

import bcrypt from "bcryptjs";
import { isAuthorizedAdmin } from "../public/authenticationMidd.js";

const initializePassport = () => {

    passport.use('register', new localStrategy({
        passReqToCallback: true,
        usernameField: 'email',
    }, async(req, username, password, done) =>{

        try {

            const { first_name, last_name, email, age, password } = req.body;
    
            // Verifica si el usuario ya está registrado
            const registeredUser = await userModel.findOne({ email });
            if (registeredUser) return done(null, false, { message: 'El correo electronico ya está en uso' })
    
            // Verifico si las credenciales son las autorizadas para ser Admin
            const administratorEmail = isAuthorizedAdmin(email)

            const cartForNewUser = await cartModel.create({})
    
            const newUser = new userModel({
                first_name,
                last_name,
                email,
                age,
                password: await bcrypt.hash(password, 10),
                cart: cartForNewUser._id,
                role: administratorEmail ? 'admin' : 'usuario'
            })
    
            const savedUser = await newUser.save(); //Guardo el nuevo usuario
    
            return done(null, savedUser);
        } catch (error) {
            console.log(error.message);
            return done(error);
            }
    }))

    passport.use("login", new localStrategy({
                usernameField: "email",
            },
            async (username, password, done) => {
                try {
                    const user = await userModel.findOne({ email: username });
                    if (!user) return done(null, false, {message: "Credenciales inválidas.",});
    
                    //compara la contraseña proporcionada con la contraseña almacenada en la base de datos
                    const isPasswordValid = bcrypt.compareSync(password, user.password);
                    if (!isPasswordValid) return done(null, false, { message: "Credenciales inválidas.",});

                    return done(null, user);
                } catch (error) {
                    console.error("Error en el proceso de autenticación:", error);
                    return done(new Error("Ha ocurrido un error en el proceso de autenticación."));
                }
            }
        )
    );
    
    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.ed6031f4666e308c',
        clientSecret: '3e67608ee55c8aad29f52be2c8776f70842f24f6',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        try {
            const userName = profile.displayName || profile.username;
            const userEmail = profile._json.email;

            const existingUser = await userModel.findOne({ email: userEmail });
            if (existingUser) return done(null, existingUser);

            // Verifico si las credenciales son las autorizadas para ser Admin
            const administratorEmail = isAuthorizedAdmin(userEmail)

            const cartNewUser = await cartModel.create({});
            const newUser = {
            first_name: userName,
            last_name: " ",
            email: userEmail,
            password: " ",
            cart: cartNewUser._id,
            role: administratorEmail ? 'admin' : 'usuario'
            };

            const result = await userModel.create(newUser);
            return done(null, result);
        } catch (err) {
            console.error('Error en el inicio de sesión con GitHub:', err);
            return done('Error en el inicio de sesión con GitHub');
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    })

}

export default initializePassport



//REGISTER
//Obtengo todos los datos del usuario y se guardan en la session.
            // const userSession = {
            //     _id: savedUser.id,
            //     first_name: savedUser.first_name,
            //     last_name: savedUser.last_name,
            //     email: savedUser.email,
            //     age: savedUser.age,
            //     role: savedUser.role,
            // }
    
            // // Almacenar toda la información del usuario en la sesión
            // req.session.user = userSession