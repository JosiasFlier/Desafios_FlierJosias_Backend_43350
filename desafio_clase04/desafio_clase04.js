// import fs from 'fs'

class ProductManager {
    #products
    #error
    constructor() {
        this.#products = []
        this.#error = undefined
    }



    getProduct = () => this.#products

    getProductById = (id) => {
        const product = this.#products.find(item => item.id === id)
        if (!product) return 'Error - El producto no existe'
        return product
    }

    #generateId = () => (this.#products.length === 0) ? 1 : this.#products[this.#products.length-1].id + 1

    #validateProduct = (title, description, price, thumnail, code, stock) => {
        if (!title || !description || !price || !thumnail || !code || !stock) {
            this.#error = `[${title}]: Datos Incompletos`
        } else {
            const found = this.#products.find(item => item.code === code)
            if (found)this.#error = `[${title}]: El codigo asignado ya existe`
            else this.#error = undefined
        }
    }

    addProduct = (title, description, price, thumnail, code, stock) => {
        this.#validateProduct(title, description, price, thumnail, code, stock)
        if (this.#error === undefined)
            this.#products.push({id: this.#generateId(), title, description, price, thumnail, code, stock})
        else 
            console.log(this.#error)
    }
}



const productManager = new ProductManager

// Añado un producto con un ID generado automaticamente sin repetirse (#generateId)

productManager.addProduct('Hábitos atómicos', 'Desarrollo personal', 10000, "https://pbs.twimg.com/media/FiuxTYDWAAM40ql.jpg:large", 12345678, 20)

// Sigo agregando Productos (Algunos con errores para que me alerte la consola)

productManager.addProduct('Código Limpio', 'Desarrollo de software', 12000, "https://images.cdn1.buscalibre.com/fit-in/360x360/87/da/87da3d378f0336fd04014c4ea153d064.jpg", 12345679, 10)

productManager.addProduct('El hombre en busca de sentido', 'Psicología - Biografía', 9000, "https://pre.tematika.com/media/catalog/Ilhsa/Imagenes/613398.jpg", 12345680, 7)

productManager.addProduct('El conquistador', 'Novela', 12000, "https://covers.alibrate.com/b/59872e92cba2bce50c1b79df/c3972b5d-de7b-473c-bf22-55f6f3e2acb0/share", 12345681,) /* ERROR - Datos incompletos */

productManager.addProduct('El psicoanalista', 'Novela', 12000, "https://images.cdn1.buscalibre.com/fit-in/360x360/0e/eb/0eebbbd43e870b09fdacf443e16d25b3.jpg", 12345678, 4) /* ERROR - Codigo duplicado*/

// Llamo a getProduct, para ver todos los productos cargados

console.log(productManager.getProduct());

// Busco Productos con el ID

console.log(productManager.getProductById(2))

console.log(productManager.getProductById(3))

// Busco un Producto que no existe

console.log(productManager.getProductById(7))


