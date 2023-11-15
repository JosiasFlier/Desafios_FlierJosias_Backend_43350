import { Router } from "express";
import { createProductController, deleteProductController, getProductByIdController, getProductsController, updatedProductController } from "../controllers/products.controller.js";

const router = Router();

// Trae todos los productos en formato JSON - Se pueden agregar params como Limit(verlo en DAO) 
//http://localhost:8080/products/ con limit (http://localhost:8080/products?limit=5)
router.get("/", getProductsController);

// Trae un producto en formato JSON, segun su ID
router.get("/:pid", getProductByIdController);

//Crea un nuevo producto
router.post("/", createProductController);

//Actualiza los datos de un producto, segun su ID
router.put("/:pid", updatedProductController)

//Elimina un producto, según su ID
router.delete("/:pid", deleteProductController);

export default router;



