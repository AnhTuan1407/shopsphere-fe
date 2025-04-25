import ApiResponse from "../models/apiResponse.model";
import ReviewRequest from "../models/review.request";
import api from "./api";

const token = localStorage.getItem("token");

const saleService = {
    createFlashSale: async (request: any): Promise<ApiResponse> => {
        const response = await api.post("/sales/flash-sale", request, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    },

    getAllFlashSales: async (): Promise<ApiResponse> => {
        const response = await api.get("/sales/flash-sale");
        return response.data;
    },

    getAllFlashSalesBySupplierId: async (id: number): Promise<ApiResponse> => {
        const response = await api.get(`/sales/flash-sale/supplier/${id}`);
        return response.data;
    },
}

export default saleService;