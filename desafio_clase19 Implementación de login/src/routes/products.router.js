import { Router } from "express";
import productModel  from "../models/products.model.js"

const router = Router();



// http://localhost:8080/products/ con limit (http://localhost:8080/products?limit=5)
router.get("/", async (req, res) => {
    console.log("¡router.get!"); // Imprime un mensaje en la consola
                    
    try {
        // Extrae parámetros de consulta de la solicitud
        const limit = req.query.limit || 10 // Límite de resultados por página (por defecto 10)
        const page = req.query.page || 1 // Página actual (por defecto 1)
        const filterOptions = {} // Objeto para opciones de filtrado

        // Si el parámetro 'stock' está presente en la consulta, se agrega a las opciones de filtrado
        if (req.query.stock) filterOptions.stock = req.query.stock
        // Si el parámetro 'category' está presente en la consulta, se agrega a las opciones de filtrado
        if (req.query.category) filterOptions.category = req.query.category

        // Objeto para opciones de paginación
        const paginateOptions = { limit, page }

        // Si el parámetro 'sort' es 'asc', se ordenan los resultados en orden ascendente por precio
        if (req.query.sort === "asc") paginateOptions.sort = { price: 1 }
        // Si el parámetro 'sort' es 'desc', se ordenan los resultados en orden descendente por precio
        if (req.query.sort === "desc") paginateOptions.sort = { price: -1 }

        // Realiza una consulta a la base de datos utilizando el modelo de producto y las opciones definidas
        const result = await productModel.paginate(filterOptions, paginateOptions)

        // Construye una respuesta JSON con los resultados y detalles de paginación
        res.status(200).json({
            status: "success",
            payload: result.docs, // Array de productos obtenidos
            totalPages: result.totalPages, // Número total de páginas
            prevPage: result.prevPage, // Página anterior
            nextPage: result.nextPage, // Página siguiente
            page: result.page, // Página actual
            hasPrevPage: result.hasPrevPage, // Indica si hay una página anterior
            hasNextPage: result.hasNextPage, // Indica si hay una página siguiente
            prevLink: result.hasPrevPage
                ? `/api/products?limit=${limit}&page=${result.prevPage}`
                : null, // Enlace a la página anterior si existe
            nextLink: result.hasNextPage
                ? `/api/products?limit=${limit}&page=${result.nextPage}`
                : null, // Enlace a la página siguiente si existe
        })
    } catch (error) {
        console.log("Error al leer el archivo:", error) 
        res.status(500).json({ error: "Error al leer el archivo" })
    }
});

router.get("/:pid", async (req, res) => {
    try{
        const id = req.params.pid
        console.log(id)
        const product = await productModel.findById(id).lean().exec()
        if (product) {
            res.status(200).json(product)
        } else {
            res.status(404).json({ error: 'producto no encontrado'})
        }
    } catch (err) {
        console.log("Error al leer el producto", err)
        res.status(500).json({status: 'error', error: err.message})
    }
});

router.post("/", async (req, res) => {
    try {
        const product = req.body //Obtiene los datos del producto

        // Crea el producto nuevo
        const addProduct = await productModel.create(product)
        const products = await productModel.find().lean().exec()
        req.app.get("socketio").emit("updatedProducts", products);
        res.status(201).json({ status: "success", payload: addProduct });
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "Error al crear el producto", error: err.message })
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid // Obtengo el id
        const newData = req.body // Obtengo los nuevos datos del producto

        // Actualiza el producto con el ID dado y devuelve el producto actualizado (new: true)
        const updatedProducts = await productModel.findByIdAndUpdate(pid, newData, { new: true }).lean().exec()
        
        // Si el producto no existe, devuelve un error 404
        if (!updatedProducts) return res.status(404).json({error: `producto con ID: '${pid}' no encontrado`})
        
        // Busca todos los productos actualizados para enviarlos a través de Socket.io
        const products = await productModel.find().lean().exec()

        // Emite un evento de Socket.io para informar sobre los productos actualizados
        req.app.get("socketio").emit("updatedProducts", products)
        res.status(201).json({ status: "success", payload: updatedProducts })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "Error al actualizar el producto", error: err.message })
    }
})

router.delete("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid // Obtengo el id

        // Elimina el producto con el id (pid)
        const deleteProduct = await productModel.findByIdAndDelete(pid)

        if (!deleteProduct)  return res.status(404).json({ error: `Producto con ID: '${pid} no encontrado` })

        // Busca todos los productos actualizados para enviarlos a través de Socket.io
        const products = await productModel.find().lean().exec()

        // Emite un evento de Socket.io para informar sobre los productos actualizados
        req.app.get("socketio").emit("updatedProducts", products)
        res.status(201).json({ status: "Producto eliminado con éxito", payload: deleteProduct })

    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "Error al eliminar el producto", error: err.message })
    }

});

export default router;



