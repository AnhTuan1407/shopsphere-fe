import ApiResponse from "../models/apiResponse.model";
import api from "./api";

const voucherService = {
    getAllVouchers: async (): Promise<ApiResponse> => {
        const response = await api.get("/sales/vouchers");
        return response.data;
    },
    getClaimedVouchersByUser: async (id: string): Promise<ApiResponse> => {
        const response = await api.get(`/sales/vouchers/claimed/${id}`);
        return response.data;
    },
    claimedVoucher: async (request: any): Promise<ApiResponse> => {
        const response = await api.post("/sales/vouchers/claim", request);
        return response.data;
    }
}

export default voucherService;