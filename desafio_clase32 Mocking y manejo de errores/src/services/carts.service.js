import CartDAO from "../dao/carts.mongo.dao.js";

import CartRepository from "../repositories/carts.repository.js";

export const CartService = new CartRepository(new CartDAO())