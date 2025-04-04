import ApiResponse from "../models/apiResponse.model";
import OrderRequest from "../models/orderRequest.model";
import api from "./api";

const token = localStorage.getItem("token");

type OrderInfoUpdationRequest = {
    fullName: string,
    phoneNumber: string,
    city: string,
    district: string,
    ward: string,
    detailAddress: string,
    defaultAddress: boolean,
}

type Address = {
    profileId: string,
    fullName: string,
    phoneNumber: string,
    city: string,
    district: string,
    ward: string,
    detailAddress: string,
    defaultAddress: boolean,
}

const orderService = {
    getAllOrderInfoByProfileId: async (id: string): Promise<ApiResponse> => {
        const response = await api.get(`/orders/address-info/${id}`);
        return response.data;
    },

    createOrder: async (request: OrderRequest): Promise<ApiResponse> => {
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
    },

    getOrderInfoById: async (id: number): Promise<ApiResponse> => {
        const response = await api.get(`/orders/address-info/find-id/${id}`);
        return response.data;
    },

    addNewOrderInfo: async (request: Address): Promise<ApiResponse> => {
        const response = await api.post(`/orders/address-info`, request);
        return response.data;
    },

    updateOrderInfo: async (id: number, request: OrderInfoUpdationRequest): Promise<ApiResponse> => {
        const response = await api.put(`/orders/address-info/${id}`,
            request,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    },

    deleteOrderInfo: async (id: number): Promise<ApiResponse> => {
        const response = await api.delete(`/orders/address-info/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    },

    setDefaultAddress: async (id: number): Promise<ApiResponse> => {
        const response = await api.put(`/orders/address-info/set-default/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    },
}

export default orderService;