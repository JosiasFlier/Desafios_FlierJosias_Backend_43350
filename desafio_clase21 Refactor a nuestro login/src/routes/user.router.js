// import { Router } from "express";
// import { isLogged } from "../public/authenticationMidd.js";

// const router = Router()

// router.get('/register', (req, res) => {
//     if (req.session.user) return res.redirect('/profile')
//     res.render('register')
// })

// router.get('/login', (req, res) => {
//     if (req.res.user) return res.redirect('/products')
//     res.render('login')
// })

// router.get('/profile', isLogged, (req, res) => {

//     const user = {
//         first_name: req.session.user.first_name,
//         last_name: req.session.user.last_name,
//         email: req.session.user.email,
//         age: req.session.user.age,
//     }
//     console.log(user)
//     res.render('profile', userInfo)
    
// })

// router.get('logout', isLogged, (req, res) => {

//     req.session.destroy((err) => {
//         if (err) return console.log(err.message)
//         res.redirect('/login')
//     })
    
// })

// export default router