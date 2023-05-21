import fs from 'fs';

class ProductManager {
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


const productManager = new ProductManager('./products.json')

// llamo a getProducts, como no hay nada, crea el archivo
console.log('')
console.log('/-----Llamo a getProducts, y se crea el archivo products.json-----/');
console.log(await productManager.getProducts());

const testing = async () => {

    try {
        // Cargo todos los libros
        console.log('')
        console.log('/-----Cargo todos los libros. Dos(2) contienen erroes-----/');
        await productManager.addProduct('Hábitos atómicos', 'Desarrollo personal', 10000, "https://pbs.twimg.com/media/FiuxTYDWAAM40ql.jpg:large", 12345678, 20)
        await productManager.addProduct('Código limpio', 'Desarrollo de software', 12000, "https://images.cdn1.buscalibre.com/fit-in/360x360/87/da/87da3d378f0336fd04014c4ea153d064.jpg", 12345679, 10)
        await productManager.addProduct('El hombre en busca de sentido', 'Psicología - Biografía', 9000, "https://pre.tematika.com/media/catalog/Ilhsa/Imagenes/613398.jpg", 12345680, 7)
        await productManager.addProduct('El conquistador', 'Novela', 12000, "https://covers.alibrate.com/b/59872e92cba2bce50c1b79df/c3972b5d-de7b-473c-bf22-55f6f3e2acb0/share", 12345678, 5)//Codigo Repetido
        await productManager.addProduct('El psicoanalista', 'Novela', 12000, "https://images.cdn1.buscalibre.com/fit-in/360x360/b0/39/b039af065268818b7bd3b0e016f8db65.jpg", 12345682, 4)
        await productManager.addProduct('1984', 'Novela', 8000, "https://images.cdn1.buscalibre.com/fit-in/360x360/0e/eb/0eebbbd43e870b09fdacf443e16d25b3.jpg", 12345683,)// Faltan Campos
        await productManager.addProduct('Frankenstein', 'Novela', 10000, "https://images.cdn1.buscalibre.com/fit-in/360x360/d3/b6/d3b63d03adc6b07a6ad05e32aa5a1411.jpg", 12345684, 4)

        console.log('')
        console.log('/-----Llamo a getProducts para ver los productos cargados-----/');
        console.log(await productManager.getProducts());

        // Busco Productos con el ID, uno que existe y otro que no
        console.log('')
        console.log('/-----Busco productos por Id. Un Id (7) no existe-----/');
        console.log(await productManager.getProductById(4));
        console.log('')
        console.log(await productManager.getProductById(7));


        // ------------------------------------------------------------------------------------------------
        // Modifico los valores del producto con ID 2
        console.log('')
        console.log('/-----Actualizo el precio y el stock de libro "Código Limpio"-----/');
        await productManager.updateProduct(2, {
            title: 'Código limpio',
            description: 'Nueva descripción',
            price: 15000,
            thumbnail: "https://images.cdn1.buscalibre.com/fit-in/360x360/87/da/87da3d378f0336fd04014c4ea153d064.jpg",
            code: 12345679,
            stock: 10});

        
        
        console.log('')
        console.log('/-----Llamo al producto modificado para ver los cambios-----/');
        console.log(await productManager.getProductById(2));

    
        
    
        // Elimino un producto por ID
        console.log('')
        console.log('/-----Elimino el Producto con el ID 5-----/');
        await productManager.deleteProductById(5);
    
        // Obtengo los productos después de eliminar un producto
        console.log('')
        console.log('/-----Llamo a getProducts para ver que el producto se eliminó-----/');
        console.log(await productManager.getProducts());


        // Elimino todos los productos
        console.log('')
        console.log('/-----Elimino todos los productos cargados-----/');
        await productManager.deleteAllProducts();

        console.log('')
        console.log('/-----Llamo a getProducts para ver que se eliminaron todos los productos-----/');
        console.log(await productManager.getProducts());


    } catch (err) {
        console.log("Hubo un error: " + err)
    }

}

testing();
