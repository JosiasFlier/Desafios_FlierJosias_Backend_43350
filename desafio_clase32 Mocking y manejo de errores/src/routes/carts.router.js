import { Router } from "express";
import productModel from "../models/products.model.js";
import { ProductService } from "../services/products.service.js";
import cartModel from "../models/carts.model.js";
import mongoose from "mongoose";
import { createNewCartController, deleteCartController, deleteProductInCartController, getCartByIdController, getCartsController, newProductForCartController, purchaseController, updateCartController, updateProductInCartController } from "../controllers/carts.controller.js";

const router = Router();

// VER TODOS LOS CARRITOS
router.get("/", getCartsController);

// VER CARRITO SEGUN SU ID
router.get("/:cid", getCartByIdController);

// CREO UN NUEVO CARRITO
router.post("/", createNewCartController);

// CARGAR PRODUCTOS AL CARRITO
router.post("/:cid/products/:pid", newProductForCartController);

// PUT - PARA ACTUALIZAR LOS DATOS DE UN CARRITO
router.put("/:cid", updateCartController);

// ACTUALIZA LA CANTIDAD DE UNIDADES DEL MISMO PRODUCTO
router.put("/:cid/products/:pid", updateProductInCartController);

//RUTA PARA ELIMINAR TODOS LOS PRODUCTOS DEL CARRITO
router.delete("/:cid", deleteCartController);

//RUTA PARA ELIMINAR UN PRODUCTO DEL CARRITO
router.delete("/:cid/products/:pid", deleteProductInCartController);

//RUTA PARA FINALIZAR LA COMPRA DE LOS PRODUCTOS EN EL CART
router.get("/:cid/purchase", purchaseController)

// http://localhost:8080/api/carts/654852965b10292027c03d11/purchase

export default router;

// DATOS PARA PROBAR EL PUT /:CID
// http://localhost:8080/api/carts/654852965b10292027c03d11
// [
//     {
//       "product": "64ca272730088da72038195f",
//       "quantity": 100
//     }
// ]

// DATOS PARA PROBAR EL PUT/:CID/PRODUCTS/:PID
// http://localhost:8080/api/carts/654852965b10292027c03d11/products/64ca272730088da72038195f
// {
//     "quantity": 500
// }
