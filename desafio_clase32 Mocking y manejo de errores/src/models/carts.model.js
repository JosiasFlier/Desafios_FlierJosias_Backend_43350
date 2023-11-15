import mongoose from "mongoose";

const cartsColeccion = 'carts'

const cartSchema = mongoose.Schema({
    products: {
        type: [{
            _id: false,
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: Number
        }],
        default: []
    }
})

// defino un middelware, para que cuando haya un findOne, se produzca un populate
cartSchema.pre('findOne', function() {this.populate('products.product')})
cartSchema.pre('find', function() {this.populate('products.product')})

mongoose.set('strictQuery', false)

const cartModel = mongoose.model(cartsColeccion, cartSchema)

export default cartModel