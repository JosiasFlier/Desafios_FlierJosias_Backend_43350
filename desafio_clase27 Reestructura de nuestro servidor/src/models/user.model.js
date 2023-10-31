import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const usersCollection = "users";

const userSchema = mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: false },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts'},
    role: { type: String, default: "usuario"},
})

mongoose.set("strictQuery", false);

const userModel = mongoose.model(usersCollection, userSchema)

export default userModel