import { Router } from "express";
import productModel from "../models/products.model.js";
import cartModel from "../models/carts.model.js";
import mongoose from "mongoose";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const carts = await cartModel.find().lean().exec();
        res.status(200).json(carts);
    } catch (error) {
        console.log("Error al obtener los carritos:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// VER ESTA PORCION DEL CODIGO
router.get("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid; //Obtener ID del carrito
        const cart = await cartModel
            .findById(cartId)
            .populate("products.product")
            .lean()
            .exec();

        if (!cart) {
            res.status(404).json({ error: "Carrito no encontrado" });
            return;
        }

        res.status(200).json({ status: "Success", payload: cart });
    } catch (err) {
        console.log("Error en el carrito:", err);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// BUSCO CARRITO POR ID SIN POPULATE - (PRUEBA) - TENGO QUE ELIMINAR DE CARTS.MODEL, LA FUNCION DE POPULATE
router.get("/sinpop/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid; //Obtener ID del carrito
        const cart = await cartModel.findById(cartId).lean().exec();

        if (!cart) {
            res.status(404).json({ error: "Carrito no encontrado" });
            return;
        }

        res.status(200).json({ status: "Success", payload: cart });
    } catch (err) {
        console.log("Error en el carrito:", err);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// CREO UN NUEVO CARRITO
router.post("/", async (req, res) => {
    try {
        const newCart = await cartModel.create({ products: [] });
        res.status(201).json({ status: "Success", payload: newCart });
    } catch (err) {
        console.log("Error al crear el carrito", err);
        return res.status(500).json({ status: "Error", error: err.message });
    }
});

// CARGAR PRODUCTOS AL CARRITO
router.post("/:cid/products/:pid", async (req, res) => {
    try {
        // Se obtiene los CID y PID
        const cartId = req.params.cid;
        const productId = req.params.pid;

        // Busca el carrito
        const cart = await cartModel.findById(cartId);
        if (!cart)
            return res
                .status(404)
                .json({ error: `Carrito con ID: ${cartId} no encontrado` });

        // Busca el producto
        const product = await productModel.findById(productId);
        if (!product)
            return res
                .status(404)
                .json({ error: `producto con ID: ${productId} no encontrado` });

        // Verifica si el producto ya existe en el carrito
        const productExistsInCart = await cart.products.findIndex((item) =>
            item.product.equals(productId)
        );

        // Si existe, le suma cantidad + 1, sino carga uno nuevo
        if (productExistsInCart !== -1) {
            cart.products[productExistsInCart].quantity += 1;
        } else {
            const newProduct = { product: productId, quantity: 1 };
            cart.products.push(newProduct);
        }

        // Guarda el carrito
        const result = await cart.save();
        res.status(201).json({ status: "success", payload: result });
    } catch (err) {
        console.log("Error al cargar productos al carrito", err);
        return res.status(500).json({ status: "Error", error: err.message });
    }
});

// PUT - PARA ACTUALIZAR LOS DATOS DE UN CARRITO
router.put("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productsToUpdate = req.body; // Obtiene los productos a actualizar desde el cuerpo de la solicitud

        // Busca el carrito
        const cart = await cartModel.findById(cartId).lean().exec();
        if (!cart) {
            return res
                .status(404)
                .json({ status: "error", message: "carrito no encontrado" });
        }

        // Actualiza los productos del carrito - y devuelve el producto actualizado (new: true)
        const cartUpdated = await cartModel
            .findByIdAndUpdate(
                cartId,
                { products: productsToUpdate },
                { new: true }
            )
            .exec();

        res.status(200).json({
            status: "success",
            message: "Carrito actualizado correctamente",
            payload: cartUpdated,
        });
    } catch (err) {
        console.log("Error al actualizar el carrito", err);
        return res.status(500).json({ status: "Error", error: err.message });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;

        // Se comprueba si "quantity" es un numero entero positivo
        if (!Number.isInteger(quantity) || quantity < 1) {
            res.status(400).json({ error: "Cantidad no valida" });
        }

        // Se busca y obtiene el carrito con el ID proporcionado
        const cart = await cartModel.findById(cartId).lean().exec();

        // Si no se encuentra el carrito, se responde con un código de estado 404 y un mensaje de error.
        if (!cart) {
            res.status(404).json({ error: "Carrito no encontrado" });
            return;
        }

        // Se busca el índice del producto en el array de productos dentro del carrito
        const existingProductIndex = cart.products.findIndex(
            (item) => item.product.toString() === productId
        );

        // Si no se encuentra el producto en el carrito, se responde con un código de estado 404 y un mensaje de error.
        if (existingProductIndex === -1) {
            res.status(404).json({
                error: "Producto no encontrado en el carrito",
            });
            return;
        }

        // Se actualiza la cantidad del producto en la posición correspondiente del array
        const updatedProducts = [...cart.products];
        updatedProducts[existingProductIndex].quantity = quantity;

        // Se actualiza el carrito en la base de datos
        const result = await cartModel
            .findByIdAndUpdate(cartId, cart, { new: true })
            .exec();

        // Se responde con un código de estado 200 y un mensaje de éxito
        res.status(200).json({
            status: "success",
            message: "Cantidad de producto actualizada correctamante",
            payload: result,
        });
    } catch (err) {
        console.log("Error al actualizar el carrito", err);
        return res.status(500).json({ status: "Error", error: err.message });
    }
});

router.delete("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartModel.findById(cartId).lean().exec();

        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        // Vaciar el array de productos del carrito
        const updatedCart = await cartModel
            .findByIdAndUpdate(cartId, { products: [] }, { new: true })
            .lean()
            .exec();

        // Si no se puede actualizar el carrito, responder con error 500
        if (!updatedCart) {
            return res.status(500).json({ error: "Error al vaciar el carrito" });
        }

        res.status(200).json({
            status: "success",
            message: "Carrito vaciado satisfactoriamente",
            cart: updatedCart,
        });
    } catch (err) {
        console.log("Error al eliminar el carrito", err);
        return res.status(500).json({ status: "Error", error: err.message });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid

        // Se busca y obtiene el carrito con el ID proporcionado
        const cart = await cartModel.findById(cartId).lean().exec();

        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        // Se busca el índice del producto en el array de productos dentro del carrito
        const existingProductIndex = cart.products.findIndex(
            (item) => item.product.toString() === productId
        );

        // Si no se encuentra el producto en el carrito, se responde con un código de estado 404 y un mensaje de error.
        if (existingProductIndex === -1) {
            res.status(404).json({
                error: "Producto no encontrado en el carrito",
            });
            return;
        }

        // Filtrar los productos y mantener solo aquellos que no correspondan al ID del producto a eliminar
        cart.products = cart.products.filter(
            (item) => !item.product.equals(productId)
        );

        // Actualizar directamente los productos del carrito en la base de datos
        const updatedCart = await cartModel
            .findByIdAndUpdate(cartId, { products: cart.products } , { new: true })
            .exec();

        return res.status(200).json({
            status: 'success',
            message: 'Producto eliminado del carrito satisfactoriamente',
            payload: updatedCart
        });
    } catch (err) {
        console.log("Error al eliminar el producto del carrito", err);
        return res.status(500).json({ status: "Error", error: err.message });
    }
});

export default router;

// DATOS PARA PROBAR EL PUT /:CID
// http://localhost:8080/api/carts/64e552070852f2dcc8c1b19b
// [
//     {
//       "product": "64ca272730088da72038195f",
//       "quantity": 10000
//     }
// ]

// DATOS PARA PROBAR EL PUT/:CID/PRODUCTS/:PID
// http://localhost:8080/api/carts/64e552070852f2dcc8c1b19b/products/64ca272730088da72038195f
// {
//     "quantity": 9
// }
