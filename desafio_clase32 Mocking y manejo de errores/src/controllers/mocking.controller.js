import { generateProduct } from '../public/mocking.js'

const products = []

//Controller para crear 100 productos falsos
export const mockingController = async (req, res) => {
    for (let i = 0; i < 100; i++){
        products.push(generateProduct())
    }
    res.send({status: 'success', payload: products})
}

