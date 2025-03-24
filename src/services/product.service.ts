import api from "./api";
import Product from "../models/product.model";

const productService = {
    getAllProducts: async (): Promise<Product[]> => {
        const response = await api.get("/products");
        return response.data.result;
    },

    getProductById: async (id: number): Promise<Product> => {
        const response = await api.get("/products/" + id);
        return response.data.result;
    }
};

export default productService;
