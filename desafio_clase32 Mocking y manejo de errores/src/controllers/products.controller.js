import CustomError from "../services/errors/custom_errors.js";
import EErrors from "../services/errors/enums.js";
import { generateProductErrorInfo } from "../services/errors/info.js";
import { ProductService } from "../services/products.service.js";

// Función para obtener todos los productos
const getAllProducts = async () => {
    return await ProductService.getAll();
};

//Traer todos los productos (Paginados)
export const getProductsController = async (req, res) => {
    console.log("¡router.get dataaa desde controller Nueva!"); // Imprime un mensaje en la consola
    const result = await ProductService.getAllPaginate(req)
    res.status(result.statusCode).json(result.response)               
    
}

//Traer producto segun su ID 
export const getProductByIdController = async (req, res) => {
    try{
        const pid = req.params.pid
        console.log(pid)

        // Llamar al método getById del ProductService para obtener el producto por su ID
        const product = await ProductService.getById(pid)

        // Comprobar si se ha encontrado el producto
        if (product) {
            res.status(200).json(product)
        } else {
            res.status(404).json({ error: 'producto no encontrado'})
        }
    } catch (err) {
        console.log("Error al leer el producto", err)
        res.status(500).json({status: 'error', error: err.message})
    }
}

//Crear un nuevo producto
export const createProductController = async (req, res) => {
    try {
        const product = req.body //Obtiene los datos del producto

        if (!product.title || !product.price || !product.description || !product.code  || !product.stock || !product.category){
            CustomError.createError({
            name: "Product creation Error",
            cause: generateProductErrorInfo(product),
            message: "Error typing to create a product",
            code: EErrors.INVALID_TYPES_ERROR
            })
        }

        // Crea el producto nuevo
        const addProduct = await ProductService.create(product)

        // Obtener todos los productos actualizados después de la creación del nuevo producto
        const products = await getAllProducts();

         // Emite un evento de Socket.io para informar sobre los productos actualizados
        req.app.get("socketio").emit("updatedProducts", products);
        res.status(201).json({ status: "success", payload: addProduct });
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "Error al crear el producto", error: err.message })
    }
}

//Actualizo los datos de un producto existente
export const updatedProductController = async (req, res) => {
    try {
        const pid = req.params.pid // Obtengo el id
        const newData = req.body // Obtengo los nuevos datos del producto

        // Actualiza el producto con el ID dado y devuelve el producto actualizado (new: true)
        const updatedProducts = await ProductService.update(pid, newData, { new: true })
        
        // Si el producto no existe, devuelve un error 404
        if (!updatedProducts) return res.status(404).json({error: `producto con ID: '${pid}' no encontrado`})
        
        // Busca todos los productos actualizados para enviarlos a través de Socket.io
        const products = await getAllProducts();

        // Emite un evento de Socket.io para informar sobre los productos actualizados
        req.app.get("socketio").emit("updatedProducts", products)
        res.status(201).json({ status: "success", payload: updatedProducts })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "Error al actualizar el producto", error: err.message })
    }
}

//Eliminar un producto proporcionando su id en params
export const deleteProductController = async (req, res) =>  {
    try {
        const pid = req.params.pid // Obtengo el id

        // Elimina el producto con el id (pid)
        const deleteProduct = await ProductService.delete(pid)

        if (!deleteProduct)  return res.status(404).json({ error: `Producto con ID: '${pid}' no encontrado` })

        // Busca todos los productos actualizados para enviarlos a través de Socket.io
        const products = await getAllProducts();

        // Emite un evento de Socket.io para informar sobre los productos actualizados
        req.app.get("socketio").emit("updatedProducts", products)
        res.status(201).json({ status: "Producto eliminado con éxito", payload: deleteProduct })

    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "Error al eliminar el producto", error: err.message })
    }
}


