import fs from "fs";

export default class ProductManager {
    #error;
    #path;
    #format;
    constructor() {
        this.#path = "./src/data/products.json";
        this.#format = "utf-8";
        this.#error = undefined;
    }

    async getProducts() {
        await this.#theFileExists();
        try {
            return JSON.parse(
                await fs.promises.readFile(this.#path, this.#format)
            );
        } catch (err) {
            console.log("Error: " + err);
        }
    }

    // Chequeo que el archivo exista, sinó lo crea.
    async #theFileExists() {
        try {
            await fs.promises.access(this.#path);
        } catch (err) {
            await fs.promises.writeFile(this.#path, "[]");
            console.log(
                `El archivo ${this.#path} no existe, se crea uno nuevo`
            );
        }
    }

    async getProductById(id) {
        try {
            let allProducts = await this.getProducts();
            let product = allProducts.find((item) => item.id === id);
            if (product) {
                return product;
            } else {
                return `No hay productos con id: ${id}`;
            }
        } catch (err) {
            console.log("Hubo un error: " + err);
        }
    }

    async #generateId() {
        const products = await this.getProducts();
        if (products && products.length > 0) {
            return products[products.length - 1].id + 1;
        } else {
            return 1;
        }
    }

    async #validateProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !code || !stock) {
            this.#error = `[${title}]: Datos Incompletos`;
        } else {
            const allProducts = await this.getProducts();
            const found = allProducts.find((item) => item.code === code);
            if (found) {
                this.#error = `[${title}]: El codigo asignado ya existe`;
            } else {
                this.#error = undefined;
            }
        }
    }

    async addProduct (title, description, price, thumbnail, code, stock) {
        await this.#validateProduct(title, description, price, thumbnail, code, stock)
        if (this.#error === undefined) {
            try {
                const products = await this.getProducts()
                const newProductId = await this.#generateId();
                products.push({id: newProductId, title, description, price, thumbnail: thumbnail || [], code, stock, category: "Libros",  status: true,})
                await fs.promises.writeFile(this.#path, JSON.stringify(products, null, '\t'))
                return { error: null }; // Devuelvo un objeto con la propiedad error como null
            } catch (error) {
                    console.error("Error al agregar el producto:", error);
                    return { error: "Error al agregar el producto" }; // Devuelvo un objeto con el mensaje de error
            }
        } else {
            console.log(this.#error)
            return { error: this.#error }; // Devuelvo un objeto con el mensaje de error
        }
    }

    // ----------------------------------------------- FUNCIONES NUEVAS DE LA CLASE 04-----------------------------------------------------------------

    async updateProduct(idProduct, productNow) {
        await this.#theFileExists();
        try {
            let allProducts = await this.getProducts();
            const productIndex = allProducts.findIndex((item) => item.id == idProduct);
            const productToUpdate = allProducts[productIndex].title
            if (productIndex === -1) {
                return { ERROR: "Producto no encontrado." };
            }

            allProducts[productIndex] = { ...allProducts[productIndex], ...productNow};
            await fs.promises.writeFile(this.#path, JSON.stringify(allProducts, null, '\t'));
            console.log(`Se actualizó el producto con id: ${idProduct} (${productToUpdate})`)
        } catch (err) {
            console.log("Hubo un error: " + err);
        }
    }

    async deleteAllProducts() {
        await this.#theFileExists();
        try {
            await fs.promises.writeFile(this.#path, "[]");
            this.idProducts = 1;
        } catch (error) {
            console.log("Hubo un error: " + err);
        }
    }


    async deleteProductById(idProduct) {
        await this.#theFileExists();
        try {
            let allProducts = await this.getProducts();
            let productIndex = allProducts.findIndex((item) => item.id == idProduct);
            const productDeleted = allProducts[productIndex].title //Guardo el titulo del producto a eliminar 
            if (productIndex === -1) {
                console.log(`No se encontró ningún producto con el id: ${idProduct}`);
                return;
            }
    
            allProducts.splice(productIndex, 1); // Elimino el producto del array
    
            await fs.promises.writeFile(this.#path, JSON.stringify(allProducts, null, '\t'));
            console.log(`Se eliminó el producto con id: ${idProduct} (${productDeleted})`);
        } catch (err) {
            console.log(err);
        }
    }
}


