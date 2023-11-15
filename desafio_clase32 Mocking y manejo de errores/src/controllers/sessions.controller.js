import UserDTO from "../dto/users.dto.js"

// Controlador para la vista de registro
export const userRegisterViewController = async (req, res) => {
    if (req.session.user) return res.redirect('/api/sessions/profile')
    res.render('register')
}

// Controlador para la vista de inicio de sesión
export const userLoginViewController = async (req, res) => {
    if (req.session.user) return res.redirect('/products')
    res.render('login')
}

// Controlador para la vista del perfil de usuario
export const userProfileViewController = async (req, res) => {
    const userData = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
    }
    console.log(userData)
    res.render('profile', userData)
}

// Controlador para cerrar sesión
export const userLogoutController = async (req, res) => {
    req.session.destroy((err) => {
        if (err) return console.log(err.message) // Manejo de error más robusto requerido aquí
        res.redirect('/api/sessions/login')
    })
}

// Controlador para la autenticación de GitHub
export const githubcallbackController = async (req, res) => {
    // Guarda la información del usuario autenticado en la sesión
    req.session.user = req.user
    // Redirige al usuario a la página de productos
    res.redirect('/products')
}

// Controlador para el registro fallido
export const userFailRegisterController = async (req, res) => {
    res.send({ error: 'Failed to register' })
}

// Controlador para la ruta 'current'
export const currentController = async (req, res) => {
    if (!req.session.user) return res.status(401).json({ status: 'error', error: 'No session detected!' })
    const userData = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role
    }

    const userDTO = new UserDTO(userData)
    res.status(200).json({ status: 'success', payload: userDTO })
}

// Controlador para la solicitud POST de inicio de sesión
export const postLoginController = async (req, res) => {
    try {
        req.session.user = req.user;
        return res.status(200).json({ status: 'success', message: 'Sesión iniciada correctamente' })

    } catch (err) {
        console.log("Error en el inicio de sesión", err);
        return res.status(500).json({ error: 'Error en el servidor.' });
    }
}

// Controlador para la solicitud POST de registro
export const postRegisterController = async (req, res) => {
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
}
