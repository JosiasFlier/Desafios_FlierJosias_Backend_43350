//MIDDLEWARS PARA LOGIN Y REGISTER

// Middleware para verificar si el usuario está autenticado
const isLogged = (req, res, next) => {
    if(req.isAuthenticated()) return next()
    res.redirect('/api/sessions/login')
}

// Middleware para verificar si el usuario es administrador
const isAdmin = (req, res, next) => {
    if(req.isAuthenticated() && req.user.role === 'admin') return next()
    res.status(403).json({ message: 'No tiene autorización para esta seccion' });
}


// Función para verificar credenciales de administrador
const isAuthorizedAdmin = (email) => {
    const authorizedEmails = [
        'adminCoder@coder.com',
        'jaf937@gmail.com'
    ]
    return authorizedEmails.includes(email)
}


export { isLogged, isAdmin, isAuthorizedAdmin }



// Middleware para verificar si el usuario es administrador
// const isAdmin = (req, res, next) => {
//     if(req.isAuthenticated() && req.session.user.role === 'admin') return next()
//     res.status(403).json({ message: 'No tiene autorización para esta seccion' });
// }
