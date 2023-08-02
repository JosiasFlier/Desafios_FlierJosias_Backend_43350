import { Router } from "express";
import ProductManager from "../dao/controllers/productManager.js";

const router = Router();

const productManager = new ProductManager();


// http://localhost:8080/products/ con limit (http://localhost:8080/products?limit=5)
router.get("/", async (req, res) => {
    const books = await productManager.getProducts();
    const limit = req.query.limit;
    if (!limit) {
        res.status(200).json(books);
    } else {
        let prodLimit = books.slice(0, limit);
        res.status(200).json(prodLimit);
    }
});

// //endpoint para leer un solo producto a partir de su ID
router.get("/:pid", async (req, res) => {
    const books = await productManager.getProducts();
    const id = req.params.pid;
    const productId = books.find((item) => item.id == id);
    if (!productId) {
        return res.status(404).json({ Error: "El libro no existe" });
    } else {
        res.status(200).json(productId);
    }
});

// //endpoint para crear a un nuevo producto
router.post("/", async (req, res) => {
    const { title, description, price, thumbnail, code, stock } = req.body;
    try {
        const result = await productManager.addProduct(
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        );
        if (result.error) {
            // Se ejecuta si hay un error de validación
            res.status(400).json({ error: result.error });
        } else {
            // Se ejecuta si el producto se agrega correctamente
            const products = await productManager.getProducts(); // Obtengo los productos actualizados
            req.app.get("socketio").emit("updatedProducts", products);

            res.status(201).json({ message: "Producto agregado con éxito" });
        }
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        res.status(500).json({ error: "Error al agregar el producto" });
    }
});

//endpoint para actualizar los datos de un producto
router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const newData = req.body;
    try {
        const books = await productManager.getProducts();
        const productId = books.find((item) => item.id == id);
        if (!productId) {
            return res.status(404).json({ Error: "El libro no existe" });
        }

        await productManager.updateProduct(id, newData);

        const products = await productManager.getProducts(); // Obtengo los productos actualizados
        req.app.get("socketio").emit("updatedProducts", products);

        res.status(200).json({ message: "Producto actualizado con éxito" });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

//endpoint para eliminar un producto
router.delete("/:pid", async (req, res) => {
    const id = req.params.pid; //obtengo el di del producto a eliminar
    try {
        const books = await productManager.getProducts();
        const productId = books.find((item) => item.id == id);
        if (!productId) {
            return res.status(404).json({ Error: "El libro no existe" });
        }

        await productManager.deleteProductById(id);

        const products = await productManager.getProducts(); // Obtengo los productos actualizados
        req.app.get("socketio").emit("updatedProducts", products);
        res.status(200).json({ message: "Producto eliminado con éxito" });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

export default router;

// {
//     "title": "LIBRO DE PRUEBA",
//     "description": "soy un libro de prueba",
//     "price": 9999,
//     "thumbnail": "https://images.cdn1.buscalibre.com/fit-in/360x360/87/da/87da3d378f0336fd04014c4ea153d064.jpg",
//     "code": 1002,
//     "stock": 10
// }
