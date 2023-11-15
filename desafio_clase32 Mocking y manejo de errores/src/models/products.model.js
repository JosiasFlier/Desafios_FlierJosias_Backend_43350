import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productsCollection = "products";

const productSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnails: { type: [String], default: [] },
    code: { type: String, required: true, unique: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    status: { type: Boolean, default: true },
});



productSchema.plugin(mongoosePaginate)

mongoose.set('strictQuery', false) //deshabilito el modo estricto solo para las consultas realizadas a través de Mongoose

const productModel = mongoose.model(productsCollection, productSchema)

export default productModel


// {
//         "title": "LIBRO DE PRUEBA 3ra preentrega",
//         "description": "soy un libro de prueba",
//         "price": 9999,
//         "thumbnails": ["https://images.cdn1.buscalibre.com/fit-in/360x360/87/da/87da3d378f0336fd04014c4ea153d064.jpg"],
//         "code": 1002,
//         "stock": 10,
//         "category": "Prueba" 
// }