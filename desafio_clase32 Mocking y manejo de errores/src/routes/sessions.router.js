import { Router } from "express";
import passport from 'passport';
import { isLogged } from "../public/authenticationMidd.js";
import { currentController, githubcallbackController, postLoginController, postRegisterController, userFailRegisterController, userLoginViewController, userLogoutController, userProfileViewController, userRegisterViewController } from "../controllers/sessions.controller.js";

const router = Router()

// Rutas para registro, inicio de sesión, perfil de usuario y cierre de sesión
router.get('/register', userRegisterViewController) // Ruta para registrarse
router.get('/login', userLoginViewController) // Ruta para el inicio de sesión
router.get('/profile', isLogged, userProfileViewController) // Ruta para la información del usuario autenticado
router.get('/logout', isLogged, userLogoutController) // Ruta para cerrar la sesión

// Rutas para autenticación de GitHub
router.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {}) // Ruta para Git Hub
router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), githubcallbackController) // Ruta Git Hub Callback

// Rutas adicionales
router.get('/failRegister', userFailRegisterController) // Ruta de registro fallido
router.get('/current', currentController) // Ruta Current

// Manejo de solicitudes POST
router.post('/login', passport.authenticate('login', { failureRedirect: '/sessions/failRegister' }), postLoginController) // Ruta para el inicio de sesión
router.post('/register', passport.authenticate("register", { failureRedirect: "/sessions/failRegister" }), postRegisterController) // Ruta para el registro

export default router