import ApiResponse from "../models/apiResponse.model";
import api from "./api";

const supplierService = {

    createSupplier: async (data: any): Promise<ApiResponse> => {
        const response = await api.post("/suppliers", data);
        return response.data;
    },

    getSupplierByUserId: async (id: string): Promise<ApiResponse> => {
        const response = await api.get(`/suppliers/by-user/${id}`);
        return response.data;
    },

    searchSupplierByName: async (name: string): Promise<ApiResponse> => {
        const response = await api.get(`/suppliers/search?name=${name}`);
        return response.data;
    },

    countProductBySupplierId: async (id: number): Promise<ApiResponse> => {
        const response = await api.get(`/products/count-product/${id}`);
        return response.data;
    },

    getSupplierById: async (id: number): Promise<ApiResponse> => {
        const response = await api.get(`/suppliers/${id}`);
        return response.data;
    },

    getAllProductsBySupplierId: async (id: number): Promise<ApiResponse> => {
        const response = await api.get(`/products/by-supplier?id=${id}`);
        return response.data;
    },
}

export default supplierService;