import { Router } from "express"
import ProductManager from "../dao/controllers/productManager.js";

const router = Router();

const productManager = new ProductManager()

const books = await productManager.getProducts()

router.get("/", async (req, res) => {
    try {
    res.render("home", { books });
    } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
    }
});

router.get("/realTimeProducts", async (req, res) => {
    try {
    res.render("realTimeProducts", { books });
    } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
    }
});

export default router;