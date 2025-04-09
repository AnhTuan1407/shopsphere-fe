import ApiResponse from "../models/apiResponse.model";
import api from "./api";

const token = localStorage.getItem("token");

const supplierService = {

    createSupplier: async (data: any): Promise<ApiResponse> => {
        const response = await api.post("/suppliers", data);
        return response.data;
    },

    getSupplierByUserId: async (id: string): Promise<ApiResponse> => {
        const response = await api.get(`/suppliers/by-user/${id}`);
        return response.data;
    },
}

export default supplierService;