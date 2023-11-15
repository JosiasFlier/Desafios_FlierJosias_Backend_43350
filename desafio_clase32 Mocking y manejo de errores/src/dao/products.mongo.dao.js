import productModel from "../models/products.model.js";

//Operaciones de CRUD de MONGO
export default class ProductDAO {
    getAll = async() => await productModel.find().lean().exec()
    getAllPaginate = async(req) => {
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
            return {
                statusCode: 200,
                response: {
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
            }}
        } catch (error) {
            console.log("Error al leer el archivo:", error)
            return {
                statusCode: 500,
                response: { status: 'error', error: error.message}
            }
        }
    }
    getAllPaginateView = async(filter, options) => await productModel.paginate(filter, options)
    getById = async(id) => await productModel.findById(id)
    getByIdViews = async(id) => await productModel.findById(id).lean().exec()
    create = async(data) => await productModel.create(data)
    update = async (id, data) => await productModel.findByIdAndUpdate(id, data , { new: true })
    delete = async(id) => await productModel.findByIdAndDelete(id)
}