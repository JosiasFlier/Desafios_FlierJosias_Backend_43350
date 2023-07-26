import { Router } from "express";
import CartManager from "../controllers/cartManager.js";

const router = Router();

const cartManager = new CartManager();

// POST para crear carritos nuevos
router.post("/", async (req, res) => {
    try {
        const addCart = await cartManager.addCart();
        console.log(addCart)
        res.status(200).json({ message: "Carrito nuevo agregado", addCart });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "error en el servidor" });
    }
});

// POST para cargar productos en el carrito
router.post("/:cid/products/:pid", async (req, res) => {
    try {
        // Obtengo los ID
        const cartId = parseInt(req.params.cid)
        const productId = parseInt(req.params.pid)

        // Validaciones de ID de carrito y producto
        if (cartId <= 0 || isNaN(cartId)) {
            return res.status(400).json({ error: "ID de carrito no válido" });
        }

        if (productId <= 0 || isNaN(productId)){
            return res.status(400).json({error: "Producto invalido"})
        }

        // Agrego el producto al carrito
        const cart = await cartManager.addProductsToCart(cartId, productId)

        if (!cart) {
            return res.status(404).json({ error: `El carrito con el id ${cartId} no existe` });
        }
        res.status(200).json({message: "Producto agregado con exito", dataCart: cart[cartId - 1]});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "error en el servidor" });
    }
});




// GET para traer un carrito por su ID
router.get("/:cid", async (req, res) => {
    
    try{
        const cartId = req.params.cid
        const cart = await cartManager.getCartById(cartId)

        if (cart) {
            res.status(200).json(cart)
        } else {
            res.status(404).json({error: `No hay carritos con el ID ${cartId}`});
        }
        
    } catch (error){
        console.log(error)
        return res.status(500).json({ error: "error en el servidor"})
    }
})

export default router;