import api from "./api";
import ApiResponse from "../models/apiResponse.model";

const cartService = {
    getCartByProfileId: async (id: string): Promise<ApiResponse> => {
        const response = await api.get("/orders/cart/" + id);
        return response.data;
    },

    addToCart: async (data: object): Promise<ApiResponse> => {
        const response = await api.post("/orders/cart/addToCart", data);
        return response.data;
    },

    selectCartItem: async (id: number): Promise<ApiResponse> => {
        const response = await api.get(`/orders/cart/select/${id}`);
        return response.data;
    },

    updateCartItem: async (id: number, quantity: number): Promise<ApiResponse> => {
        const token = localStorage.getItem("token");
        const response = await api.put(
            `/orders/cart/update-quantity/${id}`,
            { quantity },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    },

    deleteCartItem: async (id: number): Promise<ApiResponse> => {
        const token = localStorage.getItem("token");
        const response = await api.delete(
            `/orders/cart/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    }
}

export default cartService;