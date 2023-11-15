import cartModel from "../models/carts.model.js";

export default class CartDAO {
    getAll = async () => await cartModel.find().lean().exec()
    getById = async (id) => await cartModel.findById(id)
    getByIdJSON = async (id) => await cartModel.findById(id).lean().exec() //Formato Json
    getAllByIdPopulate = async (id) => await cartModel.findById(id).populate('products.product').lean().exec();
    create = async (data) => await cartModel.create(data)
    update = async (id, data) => await cartModel.findByIdAndUpdate(id, data, { new: true }).exec();
    delete = async (id) => await cartModel.findByIdAndUpdate(id, { products: [] }, { new: true }).lean().exec();
    deleteProduct = async (id, newData) => await cartModel.findByIdAndUpdate(id, { products: newData } , { new: true }).exec();
}