import ProductDAO from "../dao/products.mongo.dao.js"

import ProductRepository from "../repositories/products.repository.js"

export const ProductService = new ProductRepository(new ProductDAO());