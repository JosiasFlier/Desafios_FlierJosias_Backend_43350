import mongoose from "mongoose";
import shortid from "shortid";

const ticketsCollection = "ticket";

const ticketSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, default: () => shortid.generate(), },
    purchase_datetime: { type: Date, default: Date.now, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true },
    products: {
        type: [
            {
                _id: false,
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                },
                quantity: Number,
            },
        ],
        default: [],
    },
});

// defino un middelware, para que cuando haya un findOne, se produzca un populate
ticketSchema.pre("findOne", function () {
    this.populate("products.product");
});

mongoose.set("strictQuery", false);

const ticketModel = mongoose.model(ticketsCollection, ticketSchema);

export default ticketModel
