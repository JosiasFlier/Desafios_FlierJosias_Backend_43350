export const generateProductErrorInfo = product => {
    // La función devuelve una cadena de texto que contiene un mensaje de error detallado
    return `
    Los parámetros están incompletos o no son válidos:
        -title: Must be a String. ( ${product.title} )
        -description: Must be a String. ( ${product.description} )
        -code: Must be a String. ( ${product.code} )
        -price: Must be a Number. ( ${product.price} )
        -stock: Must be a Number. ( ${product.stock} )
        -category: Must be a String. ( ${product.category} )
    `
}