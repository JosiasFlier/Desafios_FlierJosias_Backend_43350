import express, { urlencoded } from "express";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { PORT, MONGO_DB_NAME, MONGO_URI } from "./utils.js";


const app = express();
app.use(express.json()); //Para que lea los datos en JSON
app.use(urlencoded({ extended: true }));


try {
    await mongoose.connect(`${MONGO_URI}${MONGO_DB_NAME}`)
    
    // SERVIDOR
    const serverHttp = app.listen(PORT, () => console.log(`Server Up in PORT ${PORT}`));

    // SOCKET
    const io = new Server(serverHttp);
    app.set("socketio", io);

    //RUTA RAIZ "localhost:8080"
    app.use(express.static("./src/public"));
    
    // Handlebars
    app.engine("handlebars", handlebars.engine());
    app.set("views", "./src/views");
    app.set("view engine", "handlebars");
    
    // endpoints con router
    
    // Ruta principal
    app.get("/", (req, res) => res.render("index", { name: "JOSIAS" }));
    
    app.use("/api/products", productsRouter);
    app.use("/api/carts", cartRouter);
    app.use("/home", viewsRouter);
    
    
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