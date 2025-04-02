import api from "./api";
import ApiResponse from "../models/apiResponse.model";
import OrderRequest from "../models/orderRequest.model";

const orderService = {
    getAllOrderInfoByProfileId: async (id: string): Promise<ApiResponse> => {
        const response = await api.get(`/orders/address-info/${id}`);
        return response.data;
    },

    createOrder: async (request: OrderRequest): Promise<ApiResponse> => {
        const token = localStorage.getItem("token");
        const response = await api.post(`/orders/`, request,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    },

    getAllOrderByProfileId: async (id: string): Promise<ApiResponse> => {
        const response = await api.get(`/orders/profile/${id}`);
        return response.data;
    }
}

export default orderService;