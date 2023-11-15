import { ProductService } from "../services/products.service.js";
import productModel from "../models/products.model.js";
import cartModel  from "../models/carts.model.js";

// Controlador para obtener una lista de productos con filtros opcionales
export const getProductController = async (req, res) => {
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

        const userInfo = {
            first_name: req.session.user.first_name,
            last_name: req.session.user.last_name,
            fullName: `${req.session.user.first_name} ${req.session.user.last_name}`,
            email: req.session.user.email,
            age: req.session.user.age,
            cartId: req.session.user.cart,
            role: req.session.user.role
        };

        // const products = await productModel.paginate(filter, options);
        const products = await ProductService.getAllPaginateView(filter, options);
        res.render("products", { products, userInfo });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}

// Controlador para obtener la página de inicio con una lista de productos paginados
export const getHomeController = async (req, res) => {
    try {
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

        const userInfo = {
            first_name: req.session.user.first_name,
            last_name: req.session.user.last_name,
            fullName: `${req.session.user.first_name} ${req.session.user.last_name}`,
            email: req.session.user.email,
            age: req.session.user.age,
            cartId: req.session.user.cart,
            role: req.session.user.role
        };

        res.render("home", { products, userInfo });
    } catch (error) {
        console.log("Error al leer los productos:", error);
        res.status(500).json({ error: "Error al leer los productos" });
    }
}

// Controlador para obtener una lista de todos los productos en tiempo real
export const realTimeProductsController = async (req, res) => {
    try {
        // const allProducts = await productModel.find().lean().exec();
        const allProducts = await ProductService.getAll()
        const userInfo = {
            first_name: req.session.user.first_name,
            last_name: req.session.user.last_name,
            fullName: `${req.session.user.first_name} ${req.session.user.last_name}`,
            email: req.session.user.email,
            age: req.session.user.age,
            cartId: req.session.user.cart,
            role: req.session.user.role
        };
        res.render("realTimeProducts", { products: allProducts, userInfo });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}

// Controlador para obtener los detalles de un producto en particular
export const productDetailController = async (req, res) => {
    try {
        const id = req.params.pid;
        const product = await ProductService.getByIdViews(id)
        if (product === null) {
            return res
                .status(404)
                .json({ status: "error", error: "Product not found" });
        }

        const userInfo = {
            first_name: req.session.user.first_name,
            last_name: req.session.user.last_name,
            fullName: `${req.session.user.first_name} ${req.session.user.last_name}`,
            email: req.session.user.email,
            age: req.session.user.age,
            cartId: req.session.user.cart,
            role: req.session.user.role
        };

        res.render("productDetail", {product, userInfo});
    } catch (error) {
        res.status(500).json({ error: "Error al leer los productos" });
    }
}

// Controlador para obtener los detalles de un carrito en particular
export const cartController = async (req, res) => {
    try {
        const id = req.params.cid
        const result = await cartModel.findById(id).lean().exec();
        if (result === null) {
            return res.status(404).json({ status: 'error', error: 'Cart not found' });
        }

        const userInfo = {
            first_name: req.session.user.first_name,
            last_name: req.session.user.last_name,
            fullName: `${req.session.user.first_name} ${req.session.user.last_name}`,
            email: req.session.user.email,
            age: req.session.user.age,
            cartId: req.session.user.cart,
            role: req.session.user.role
        };


        res.render('carts', { cid: result._id, cart: result.products, userInfo});
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
}

