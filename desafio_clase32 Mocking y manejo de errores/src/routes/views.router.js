import { Router } from "express";
import { isAdmin, isLogged } from "../public/authenticationMidd.js";
import { cartController, getHomeController, getProductController, productDetailController, realTimeProductsController } from "../controllers/views.controller.js";

const router = Router();

// Rutas para diferentes funciones del controlador
router.get("/", isLogged, getProductController); // Obtener productos
router.get("/home", getHomeController); // Obtener página de inicio
router.get("/realTimeProducts", isLogged, isAdmin, realTimeProductsController); // Obtener productos en tiempo real
router.get("/:pid", isLogged, productDetailController); // Obtener detalles de un producto
router.get('/carts/:cid', isLogged, cartController); // Obtener carrito

export default router;