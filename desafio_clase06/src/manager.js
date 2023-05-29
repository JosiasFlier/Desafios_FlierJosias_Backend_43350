import fs from 'fs';

export default class ProductManager {
    #error
    #path
    #format
    constructor(path) {
        this.#path = path
        this.#format = 'utf-8'
        this.#error = undefined
    }



    async getProducts () {
        await this.#theFileExists()
        try {
            return JSON.parse(await fs.promises.readFile(this.#path, this.#format))
        } catch (err) {
            console.log('Error: ' + err)
        }    
    }

    // Chequeo que el archivo exista, sinó lo crea. 
    async #theFileExists() {
        try {
        await fs.promises.access(this.#path);
        } catch (err) {
            await fs.promises.writeFile(this.#path, "[]")
            console.log(`El archivo ${this.#path} no existe, se crea uno nuevo`);
        }
    }

    async getProductById (id) {
        try {
            let allProducts = await this.getProducts();
            let product = allProducts.find((item) => item.id === id);
                if (product) {
                    return product;
                } else {
                    return `No hay productos con id: ${id}`;
                }
        } catch (err) {
            console.log('Hubo un error: ' + err);
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

    async #validateProduct (title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            this.#error = `[${title}]: Datos Incompletos`
        } 
        else {
            const allProducts = await this.getProducts();
            const found = allProducts.find(item => item.code === code)
                if (found) {
                    this.#error = `[${title}]: El codigo asignado ya existe`
                } else {
                    this.#error = undefined
                }
        }
    }

    async addProduct (title, description, price, thumbnail, code, stock) {
        await this.#validateProduct(title, description, price, thumbnail, code, stock)
        if (this.#error === undefined) {
            try {
                const products = await this.getProducts()
                const newProductId = await this.#generateId();
                products.push({id: newProductId, title, description, price, thumbnail, code, stock})
                await fs.promises.writeFile(this.#path, JSON.stringify(products, null, '\t'))
            } catch (error) {
                    console.error("Error al agregar el producto:", error);
            }
        } else {
            console.log(this.#error)
        }
    }

// ----------------------------------------------- FUNCIONES NUEVAS DE LA CLASE 04-----------------------------------------------------------------


    async updateProduct(idProduct, productNow) {
        await this.#theFileExists();
        try {
            let allProducts = await this.getProducts();
            const index = allProducts.findIndex((item) => item.id === idProduct);
            if (index === -1) {
                return { ERROR: 'Producto no encontrado.'}
            }

            allProducts[index] = {...productNow, id: idProduct}
            await fs.promises.writeFile(this.#path, JSON.stringify(allProducts, null, 2));
            return `Se actualizó el producto con id: ${idProduct}`;
        } catch (err) {
            console.log('Hubo un error: ' + err);
        }
    }

    async deleteAllProducts() {
        await this.#theFileExists();
        try {
            await fs.promises.writeFile(this.#path, '[]');
            this.idProducts = 1;
        } catch (err) {
            console.log('Hubo un error: ' + err);
        }
    }

    async deleteProductById(idProduct) {
        await this.#theFileExists();
        try {
            let allProducts = await this.getProducts();
            let product = allProducts.filter((item) => item.id !== idProduct);
            await fs.promises.writeFile(this.#path, JSON.stringify(product));
            console.log(`Se eliminó el producto con id: ${idProduct}`);
        } catch (err) {
            console.log(err);
        }
    }
};
