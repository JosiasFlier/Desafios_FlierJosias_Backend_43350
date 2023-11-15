import express, { urlencoded } from "express";
import session from 'express-session'
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import passport from "passport";
import initializePassport from "./config/passport.config.js"
import errorHandler from './middlewares/error.middleware.js'

// ROUTERS
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js"
import mailsRouter from './routes/mails.router.js'
import mockingRouter from './routes/mocking.router.js'

import { PORT, MONGO_DB_NAME, MONGO_URI } from "./utils.js";
import { isLogged } from "./public/authenticationMidd.js";


const app = express();
app.use(express.json()); //Para que lea los datos en JSON
app.use(errorHandler) // Midd con mensaje de error
app.use(urlencoded({ extended: true }));

// Configuración de la sesión
app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO_URI,
        dbName: MONGO_DB_NAME,
        mongoOptions : {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }),
    secret: 'secret',// Clave secreta
    resave: true,// Forzar el almacenamiento de sesiones
    saveUninitialized: true// Guardar sesiones no inicializadas
}))

// Configuracion passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");


try {
    await mongoose.connect(`${MONGO_URI}${MONGO_DB_NAME}`)
    
    // SERVIDOR
    const serverHttp = app.listen(PORT, () => console.log(`Server Up in PORT ${PORT}`));

    // SOCKET
    const io = new Server(serverHttp);
    app.set("socketio", io);

    //RUTA RAIZ "localhost:8080"
    app.use(express.static("./src/public"));
    
    
    // endpoints con router
    
    // Ruta principal
    app.get("/", isLogged, (req, res) => {
        res.redirect("/products");
        });
    
    // DAO
    app.use("/api/products", productsRouter);
    app.use("/api/carts", cartRouter);
    
    // Ruta para renderizar las vistas de handlebars
    app.use('/api/sessions', sessionsRouter); //sesiones
    app.use("/products", viewsRouter); 

    // Ruta para el envio de e-mails
    app.use('/email', mailsRouter)

    // Ruta en desarrollo - testing - errores
    app.get("/desarrollo", (req, res) => res.render("enDesarrollo"));
    app.use('/mockingproducts', mockingRouter); // Generar productos aleatorios con Faker(Mock)

    // 'connection' palabra reservada, es un evento, para detectar
    // cuando se realiza una coneccion con el cliente
    // Programacion orientada a eventos
    io.on("connection", socket => {
        console.log("Nuevo cliente conectado!!");
        socket.on("productList", (data) => {
            io.emit("updatedProducts", data);
        });
    });
    
} catch (err) {
    console.log(err.message)
}






// COMANDOS

// Carrito
// POST http://localhost:8080/api/carts/  (crea un nuevo carrito)
// POST http://localhost:8080/api/carts/1/products/1 (cargo productos al carrito)
// GET http://localhost:8080/api/carts/1 (busco carrito por id)

// Vistas Handelbars
// http://localhost:8080/home (vista de todos los productos)
// http://localhost:8080/home/realTimeProducts (Productos en tiempo real - agregar/eliminar)