import fs from "fs";

export default class CartManager {
    // #error;
    #path;
    #format;

    constructor() {
        this.#path = "./src/data/cart.json";
        this.#format = "utf-8";
        this.carts = [];
        // this.#error = undefined;
    }

    // Devolvemos el arreglo con todos los productos agregados al carrito. En caso de error lo mostramos por consola
    getCarts = async () => {
        try {
            return JSON.parse(
                await fs.promises.readFile(this.#path, this.#format)
            );
        } catch (error) {
            console.log("error: archivo no encontrado");
            return this.carts;
        }
    };

    async #generateId() {
        const carts = await this.getCarts();
        if (carts && carts.length > 0) {
            return carts[carts.length - 1].id + 1;
        } else {
            return 1;
        }
    }

    addCart = async (products) => {
        const carts = await this.getCarts();

        const newCart = {
            id: await this.#generateId(),
            products: (products = []),
        };

        carts.push(newCart);

        // Escribir el array actualizado del carrito en el archivo
        await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, "\t"));

        // Actualizo el array del carrito
        this.carts = carts;

        // Devolver el nuevo producto
        return newCart;
    };

    async getCartById(id) {
        try {
            let allCarts = await this.getCarts();
            let cart = allCarts.find((item) => item.id == id);
            return cart
        } catch (err) {
            console.log("Hubo un error: " + err);
        }
    }

    async addProductsToCart (cartId, productId) {
        const carts = await this.getCarts();
        // Busco el indice del carrito
        const cartIndex = carts.findIndex((item) => item.id == cartId)
        if (cartIndex == -1) {
            return null // El carrito no existe
        }

        const cart = carts[cartIndex]

        // Verifico si el producto existe
        const productIndex = cart.products.findIndex((item) => item.product == productId)
        // Si existe, actualizo la cantidad, si no existe, lo agrego al carrito
        if (productIndex !== - 1){
            cart.products[productIndex].quantity++
        } else {
            const newProduct = {
                product: productId,
                quantity: 1
            }
            cart.products.push(newProduct)
        }

        // Actualizo el carrito
        carts[cartIndex] = cart

        // Guardo los cambios en el JSON del carrito
        await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, "\t"))

        return carts
    }
}
