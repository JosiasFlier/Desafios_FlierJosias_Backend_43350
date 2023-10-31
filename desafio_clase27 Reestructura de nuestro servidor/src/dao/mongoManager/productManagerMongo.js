import productModel from "../../models/products.model.js";

class ProductManager {
    static async readProducts() {
        await productModel.find().lean().exec();
    }
    
    async getProducts(limit, page, sort, category, availability) {
        try {
            let filter = {};
            if (category) {
                filter = { category };
            }
            if (availability) {
                filter = { ...filter, stock: availability };
            }
            let sortOptions = {};
            if (sort === "asc") {
                sortOptions = { price: 1 };
            } else if (sort === "desc") {
                sortOptions = { price: -1 };
            }
            const options = {
                limit,
                page,
                sort: sortOptions,
            };
            const result = await productModel.paginate(filter, options);
            const totalPages = result.totalPages;
            const prevPage = result.prevPage;
            const nextPage = result.nextPage;
            const currentPage = result.page;
            const hasPrevPage = result.hasPrevPage;
            const hasNextPage = result.hasNextPage;
            const prevLink = hasPrevPage ? `/api/products?page=${prevPage}` : null;
            const nextLink = hasNextPage ? `/api/products?page=${nextPage}` : null;

            return {
                status: "success",
                payload: result.docs,
                totalPages,
                prevPage,
                nextPage,
                page: currentPage,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink,
            };
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
}

export default ProductManager;



// async getProducts(limit, page, sort, category, availability) {
//     try {
//         let filter = {};
//         if (category) {
//             filter = { category };
//         }
//         if (availability) {
//             filter = { ...filter, stock: availability };
//         }
//         let sortOptions = {};
//         if (sort === "asc") {
//             sortOptions = { price: 1 };
//         } else if (sort === "desc") {
//             sortOptions = { price: -1 };
//         }
//         const options = {
//             limit,
//             page,
//             sort: sortOptions,
//         };
//         const result = await productModel.paginate(filter, options);
//         const totalPages = result.totalPages;
//         const prevPage = result.prevPage;
//         const nextPage = result.nextPage;
//         const currentPage = result.page;
//         const hasPrevPage = result.hasPrevPage;
//         const hasNextPage = result.hasNextPage;
//         const prevLink = hasPrevPage ? `/api/products?page=${prevPage}` : null;
//         const nextLink = hasNextPage ? `/api/products?page=${nextPage}` : null;

//         return {
//             status: "success",
//             payload: result.docs,
//             totalPages,
//             prevPage,
//             nextPage,
//             page: currentPage,
//             hasPrevPage,
//             hasNextPage,
//             prevLink,
//             nextLink,
//         };
//     } catch (error) {
//         console.log(error);
//         throw new Error(error.message);
//     }
// }