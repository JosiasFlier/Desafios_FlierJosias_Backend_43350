export default class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    getAll = async () => await this.dao.getAll() // Traer todos los carritos
    getById = async (id) => await this.dao.getById(id) // Traer un carrito por su ID
    getByIdJSON = async (id) => await this.dao.getByIdJSON(id) // Traer un carrito por su ID  en formato JSON
    getAllByIdPopulate = async (id) => await this.dao.getAllByIdPopulate(id) // Traer un carrito por su ID con population
    create = async (data) => await this.dao.create(data) // Crear un carrito
    update = async (id, data) => await this.dao.update(id, data) // Actualizar un carrito
    delete = async (id) => await this.dao.delete(id) // Eliminar todos los productos de un carrito
    deleteProduct = async (id, newData) => await this.dao.deleteProduct(id, newData) // Eliminar un producto del carrito
}