import api from "./api";
import Product from "../models/product.model";
import ApiResponse from "../models/apiResponse.model";

const productService = {
    getAllProducts: async (): Promise<Product[]> => {
        const response = await api.get("/products");
        return response.data.result;
    },

    getProductById: async (id: number): Promise<Product> => {
        const response = await api.get("/products/" + id);
        return response.data.result;
    },

    getAllSuppliers: async (): Promise<any[]> => {
        const response = await api.get("/suppliers");
        return response.data.result;
    },

    getProductByVariantId: async (id: number): Promise<any> => {
        const response = await api.get(`/products/by-variant/${id}`);
        return response.data;
    },

    createProduct: async (request: any): Promise<ApiResponse> => {
        const response = await api.post("/products", request);
        return response.data;
    },

    getVariantById: async (id: number): Promise<any> => {
        const response = await api.get(`/product-variants/${id}`);
        return response.data;
    },

    getProductByCategoryId: async (id: number): Promise<ApiResponse> => {
        const response = await api.get(`/products/by-category?id=${id}`);
        return response.data;
    },
};

export default productService;
