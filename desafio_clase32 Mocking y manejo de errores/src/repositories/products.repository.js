export default class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    getAll = async() => await this.dao.getAll()
    getAllPaginate = async(req) => await this.dao.getAllPaginate(req) //solo para JSON
    getAllPaginateView = async(filter, options) => await this.dao.getAllPaginateView(filter, options)
    getById = async(id) => await this.dao.getById(id) // en formato mongoose para la manipulacion de archivos
    getByIdViews = async(id) => await this.dao.getByIdViews(id) 
    create = async(data) => await this.dao.create(data)
    update = async (id, data) => await this.dao.update(id, data)
    delete = async(id) => await this.dao.delete(id)
}