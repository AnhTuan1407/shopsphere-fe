import api from "./api";
import ApiResponse from "../models/apiResponse.model";

const cartService = {
    getCartByProfileId: async (id: string): Promise<ApiResponse> => {
        const response = await api.get("/orders/cart/" + id);
        return response.data;
    }

}

export default cartService;