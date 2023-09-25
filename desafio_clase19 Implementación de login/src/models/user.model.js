import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const usersCollection = "users";

const userSchema = mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true},
})

mongoose.set("strictQuery", false);

const userModel = mongoose.model(usersCollection, userSchema)

export default userModel