import { Router } from "express";
import productModel from "../models/products.model.js";
import cartModel  from "../models/carts.model.js";
import { isAdmin, isLogged } from "../public/authenticationMidd.js";

const router = Router();

router.get("/", isLogged, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort || "";
        const category = req.query.category || "";
        const availability = parseInt(req.query.stock) || "";

        let filter = {};
        // Aplicar filtro por categoría si se proporciona
        if (req.query.category) {
            filter = { category };
        }
        // Aplicar filtro por stock si se proporciona
        if (req.query.stock) {
            filter = { ...filter, stock: availability };
        }
        let sortOptions = {};
        // Aplicar ordenamiento si se proporciona sort
        if (sort === "asc") {
            sortOptions = { price: 1 };
        } else if (sort === "desc") {
            sortOptions = { price: -1 };
        }
        const options = {
            limit,
            page,
            sort: sortOptions,
            lean: true,
        };
        const products = await productModel.paginate(filter, options);
        res.render("products", { products });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});

// revisarlo, sinó borrar
router.get("/home", async (req, res) => {
    try {
        //const products = await ProductModel.find().lean().exec();
        let pageNum = parseInt(req.query.page) || 1;
        let itemsPorPage = parseInt(req.query.limit) || 10;
        const products = await productModel.paginate(
            {},
            { page: pageNum, limit: itemsPorPage, lean: true }
        );

        products.prevLink = products.hasPrevPage
            ? `/products?limit=${itemsPorPage}&page=${products.prevPage}`
            : "";
        products.nextLink = products.hasNextPage
            ? `/products?limit=${itemsPorPage}&page=${products.nextPage}`
            : "";

        console.log(products);

        res.render("home", products);
    } catch (error) {
        console.log("Error al leer los productos:", error);
        res.status(500).json({ error: "Error al leer los productos" });
    }
});

router.get("/realTimeProducts", isLogged, isAdmin, async (req, res) => {
    try {
        const allProducts = await productModel.find().lean().exec();
        res.render("realTimeProducts", { products: allProducts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});

router.get("/:pid", isLogged, async (req, res) => {
    try {
        const id = req.params.pid;
        const result = await productModel.findById(id).lean().exec();
        if (result === null) {
            return res
                .status(404)
                .json({ status: "error", error: "Product not found" });
        }
        res.render("productDetail", result);
    } catch (error) {
        res.status(500).json({ error: "Error al leer los productos" });
    }
});

router.get('/carts/:cid', isLogged, async (req, res) => {
    // ID del carrito: 64a36d28ae5981f3f6e4488e
    try {
        const id = req.params.cid
        const result = await cartModel.findById(id).lean().exec();
        if (result === null) {
            return res.status(404).json({ status: 'error', error: 'Cart not found' });
        }
        res.render('carts', { cid: result._id, products: result.products });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
})

export default router;



// TODOS CON MIDDELWARE

// router.get("/", isLogged, async (req, res) => {
//     try {
//         const limit = parseInt(req.query.limit) || 10;
//         const page = parseInt(req.query.page) || 1;
//         const sort = req.query.sort || "";
//         const category = req.query.category || "";
//         const availability = parseInt(req.query.stock) || "";

//         let filter = {};
//         // Aplicar filtro por categoría si se proporciona
//         if (req.query.category) {
//             filter = { category };
//         }
//         // Aplicar filtro por stock si se proporciona
//         if (req.query.stock) {
//             filter = { ...filter, stock: availability };
//         }
//         let sortOptions = {};
//         // Aplicar ordenamiento si se proporciona sort
//         if (sort === "asc") {
//             sortOptions = { price: 1 };
//         } else if (sort === "desc") {
//             sortOptions = { price: -1 };
//         }
//         const options = {
//             limit,
//             page,
//             sort: sortOptions,
//             lean: true,
//         };
//         const products = await productModel.paginate(filter, options);
//         res.render("products", { products });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: error });
//     }
// });

// // revisarlo, sinó borrar
// router.get("/home", async (req, res) => {
//     try {
//         //const products = await ProductModel.find().lean().exec();
//         let pageNum = parseInt(req.query.page) || 1;
//         let itemsPorPage = parseInt(req.query.limit) || 10;
//         const products = await productModel.paginate(
//             {},
//             { page: pageNum, limit: itemsPorPage, lean: true }
//         );

//         products.prevLink = products.hasPrevPage
//             ? `/products?limit=${itemsPorPage}&page=${products.prevPage}`
//             : "";
//         products.nextLink = products.hasNextPage
//             ? `/products?limit=${itemsPorPage}&page=${products.nextPage}`
//             : "";

//         console.log(products);

//         res.render("home", products);
//     } catch (error) {
//         console.log("Error al leer los productos:", error);
//         res.status(500).json({ error: "Error al leer los productos" });
//     }
// });

// router.get("/realTimeProducts", isLogged, isAdmin, async (req, res) => {
//     try {
//         const allProducts = await productModel.find().lean().exec();
//         res.render("realTimeProducts", { products: allProducts });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: error });
//     }
// });

// router.get("/:pid", isLogged, async (req, res) => {
//     try {
//         const id = req.params.pid;
//         const result = await productModel.findById(id).lean().exec();
//         if (result === null) {
//             return res
//                 .status(404)
//                 .json({ status: "error", error: "Product not found" });
//         }
//         res.render("productDetail", result);
//     } catch (error) {
//         res.status(500).json({ error: "Error al leer los productos" });
//     }
// });

// router.get('/carts/:cid', isLogged, async (req, res) => {
//     // ID del carrito: 64a36d28ae5981f3f6e4488e
//     try {
//         const id = req.params.cid
//         const result = await cartModel.findById(id).lean().exec();
//         if (result === null) {
//             return res.status(404).json({ status: 'error', error: 'Cart not found' });
//         }
//         res.render('carts', { cid: result._id, products: result.products });
//     } catch (error) {
//         res.status(500).json({ status: 'error', error: error.message });
//     }
// })
